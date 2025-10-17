<script setup>
import { useInfiniteScroll } from '@vueuse/core'
import { Loader, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const links = ref([])
const limit = 24
let cursor = ''
let listComplete = false
let listError = false

const sortBy = ref('az')
const selectedLinks = ref([])
const dateRangeFilter = ref(null)
const selectedTags = ref([])

const displayedLinks = computed(() => {
  let filtered = [...links.value]

  // Apply date range filter
  if (dateRangeFilter.value) {
    filtered = filtered.filter((link) => {
      return link.createdAt >= dateRangeFilter.value.start && link.createdAt <= dateRangeFilter.value.end
    })
  }

  // Apply tag filter
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter((link) => {
      if (!link.tags || !Array.isArray(link.tags))
        return false
      return selectedTags.value.some(tag => link.tags.includes(tag))
    })
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'newest':
      return filtered.sort((a, b) => b.createdAt - a.createdAt)
    case 'oldest':
      return filtered.sort((a, b) => a.createdAt - b.createdAt)
    case 'az':
      return filtered.sort((a, b) => a.slug.localeCompare(b.slug))
    case 'za':
      return filtered.sort((a, b) => b.slug.localeCompare(a.slug))
    case 'most-clicks':
      return filtered.sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    case 'least-clicks':
      return filtered.sort((a, b) => (a.clicks || 0) - (b.clicks || 0))
    default:
      return filtered
  }
})

async function fetchClickCounts(linkIds) {
  if (!linkIds || linkIds.length === 0) return
  
  try {
    const ids = linkIds.join(',')
    const clickCounts = await useAPI('/api/link/clicks', {
      query: { ids },
    })
    
    // Update links with their click counts
    links.value.forEach((link) => {
      if (clickCounts[link.id] !== undefined) {
        link.clicks = clickCounts[link.id]
      } else {
        // Ensure all links have a clicks property, defaulting to 0
        link.clicks = link.clicks || 0
      }
    })
  }
  catch (error) {
    console.error('Failed to fetch click counts:', error)
    // Set default clicks value for all links if API fails
    links.value.forEach((link) => {
      link.clicks = link.clicks || 0
    })
  }
}

async function getLinks() {
  try {
    const data = await useAPI('/api/link/list', {
      query: {
        limit,
        cursor,
      },
    })
    const newLinks = data.links.filter(Boolean) // Sometimes cloudflare will return null, filter out
    links.value = links.value.concat(newLinks)
    cursor = data.cursor
    listComplete = data.list_complete
    listError = false

    // Fetch click counts for the new links
    if (newLinks.length > 0) {
      await fetchClickCounts(newLinks.map(link => link.id))
    }
  }
  catch (error) {
    console.error(error)
    listError = true
  }
}

const { isLoading } = useInfiniteScroll(
  document,
  getLinks,
  {
    distance: 150,
    interval: 1000,
    canLoadMore: () => {
      return !listError && !listComplete
    },
  },
)

function updateLinkList(link, type) {
  if (type === 'edit') {
    const index = links.value.findIndex(l => l.id === link.id)
    links.value[index] = link
  }
  else if (type === 'delete') {
    const index = links.value.findIndex(l => l.id === link.id)
    links.value.splice(index, 1)
    // Remove from selected links if it was selected
    const selectedIndex = selectedLinks.value.indexOf(link.slug)
    if (selectedIndex > -1) {
      selectedLinks.value.splice(selectedIndex, 1)
    }
  }
  else {
    links.value.unshift(link)
    sortBy.value = 'newest'
  }
}

async function bulkDelete() {
  if (selectedLinks.value.length === 0)
    return

  try {
    await useAPI('/api/link/bulk-delete', {
      method: 'POST',
      body: { slugs: selectedLinks.value },
    })

    // Remove deleted links from the local list
    links.value = links.value.filter(link => !selectedLinks.value.includes(link.slug))
    selectedLinks.value = []

    toast.success('Selected links deleted successfully!')
  }
  catch (error) {
    console.error('Failed to delete links:', error)
    toast.error('Failed to delete selected links')
  }
}

function updateSelectedLinks(newSelectedLinks) {
  selectedLinks.value = newSelectedLinks
}

// Watch for sort changes to clicks-based sorting and refresh click counts
watch(sortBy, async (newSortBy) => {
  if (newSortBy === 'most-clicks' || newSortBy === 'least-clicks') {
    // Ensure all links have click counts
    const allLinkIds = links.value.map(link => link.id)
    await fetchClickCounts(allLinkIds)
  }
})
</script>

<template>
  <main class="space-y-6">
    <div class="flex flex-col gap-6 sm:gap-2 sm:flex-row sm:justify-between">
      <DashboardNav class="flex-1">
        <div class="flex items-center gap-2">
          <DashboardLinksEditor @update:link="updateLinkList" />
          <DashboardLinksSort v-model:sort-by="sortBy" />
          <Button
            v-if="selectedLinks.length > 0"
            variant="destructive"
            size="sm"
            class="flex items-center gap-2"
            @click="bulkDelete"
          >
            <Trash2 class="w-4 h-4" />
            Delete Selected ({{ selectedLinks.length }})
          </Button>
        </div>
      </DashboardNav>
      <LazyDashboardLinksSearch />
    </div>
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
      <DashboardLinksDateRangeFilter @update:date-range="dateRangeFilter = $event" />
      <DashboardLinksTagFilter v-model:selected-tags="selectedTags" />
    </div>
    <div
      v-if="!isLoading && links.length === 0"
      class="flex flex-col items-center justify-center py-16 text-center space-y-4"
    >
      <div class="text-6xl text-muted-foreground">
        🔗
      </div>
      <h3 class="text-2xl font-semibold">
        {{ $t('links.no_links_yet') }}
      </h3>
      <p class="text-muted-foreground max-w-md">
        {{ $t('links.create_first_link') }}
      </p>
      <DashboardLinksEditor @update:link="updateLinkList">
        <Button size="lg">
          {{ $t('links.create') }}
        </Button>
      </DashboardLinksEditor>
    </div>
    <section
      v-else
      class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      <DashboardLinksLink
        v-for="link in displayedLinks"
        :key="link.id"
        :link="link"
        :selected-links="selectedLinks"
        @update:link="updateLinkList"
        @update:selected-links="updateSelectedLinks"
      />
    </section>
    <div
      v-if="isLoading"
      class="flex items-center justify-center"
    >
      <Loader class="animate-spin" />
    </div>
    <div
      v-if="!isLoading && listComplete"
      class="flex items-center justify-center text-sm"
    >
      {{ $t('links.no_more') }}
    </div>
    <div
      v-if="listError"
      class="flex items-center justify-center text-sm"
    >
      {{ $t('links.load_failed') }}
      <Button variant="link" @click="getLinks">
        {{ $t('common.try_again') }}
      </Button>
    </div>
  </main>
</template>
