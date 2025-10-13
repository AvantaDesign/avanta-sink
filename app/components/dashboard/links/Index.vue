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

const displayedLinks = computed(() => {
  const sorted = [...links.value]
  switch (sortBy.value) {
    case 'newest':
      return sorted.sort((a, b) => b.createdAt - a.createdAt)
    case 'oldest':
      return sorted.sort((a, b) => a.createdAt - b.createdAt)
    case 'az':
      return sorted.sort((a, b) => a.slug.localeCompare(b.slug))
    case 'za':
      return sorted.sort((a, b) => b.slug.localeCompare(a.slug))
    default:
      return sorted
  }
})

async function getLinks() {
  try {
    const data = await useAPI('/api/link/list', {
      query: {
        limit,
        cursor,
      },
    })
    links.value = links.value.concat(data.links).filter(Boolean) // Sometimes cloudflare will return null, filter out
    cursor = data.cursor
    listComplete = data.list_complete
    listError = false
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

    toast('Selected links deleted successfully!')
  }
  catch (error) {
    console.error('Failed to delete links:', error)
    toast('Failed to delete selected links')
  }
}

function updateSelectedLinks(newSelectedLinks) {
  selectedLinks.value = newSelectedLinks
}
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
    <section class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
