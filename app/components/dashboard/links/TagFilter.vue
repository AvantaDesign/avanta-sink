<script setup>
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'
import { Check, ChevronsUpDown, Tags } from 'lucide-vue-next'
import { VList } from 'virtua/vue'

const emit = defineEmits(['update:selectedTags'])

const [TriggerTemplate, TriggerComponent] = createReusableTemplate()
const [FilterTemplate, FilterComponent] = createReusableTemplate()

const isDesktop = useMediaQuery('(min-width: 640px)')

const links = ref([])
const isOpen = ref(false)
const selectedTags = ref([])

// Extract unique tags from all links
const availableTags = computed(() => {
  const tagSet = new Set()
  links.value.forEach((link) => {
    if (link.tags && Array.isArray(link.tags)) {
      link.tags.forEach(tag => tagSet.add(tag))
    }
  })
  return Array.from(tagSet).sort()
})

async function getLinks() {
  links.value = await useAPI('/api/link/search')
}

onMounted(() => {
  getLinks()
})

watch(selectedTags, (value) => {
  emit('update:selectedTags', value)
}, { deep: true })
</script>

<template>
  <TriggerTemplate>
    <Button
      variant="outline"
      role="combobox"
      :aria-expanded="isOpen"
      class="flex justify-between px-3 w-full sm:w-48"
    >
      <Tags class="h-4 w-4 sm:mr-2" />
      <div class="flex-1 text-left truncate" :class="selectedTags.length ? 'text-foreground' : 'text-muted-foreground'">
        <span class="hidden sm:inline">
          {{ selectedTags.length ? `${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''}` : $t('links.tags.filter_placeholder') }}
        </span>
      </div>
      <ChevronsUpDown class="ml-2 w-4 h-4 opacity-50 shrink-0" />
    </Button>
  </TriggerTemplate>
  <FilterTemplate>
    <Command v-model="selectedTags" multiple>
      <CommandInput :placeholder="$t('links.tags.filter_placeholder')" />
      <CommandEmpty>{{ $t('links.tags.no_tags') }}</CommandEmpty>
      <CommandList :class="{ 'max-h-none': !isDesktop }">
        <CommandGroup>
          <VList
            v-slot="{ item: tag }"
            :data="availableTags"
            :style="{ height: isDesktop ? '292px' : '420px' }"
          >
            <CommandItem :value="tag">
              <Check
                :class="cn(
                  'mr-2 h-4 w-4',
                  selectedTags.includes(tag) ? 'opacity-100' : 'opacity-0',
                )"
              />
              {{ tag }}
            </CommandItem>
          </VList>
        </CommandGroup>
      </CommandList>
    </Command>
  </FilterTemplate>
  <Popover v-if="isDesktop" v-model:open="isOpen">
    <PopoverTrigger as-child>
      <TriggerComponent />
    </PopoverTrigger>
    <PopoverContent class="p-0 w-full sm:w-48">
      <FilterComponent />
    </PopoverContent>
  </Popover>

  <Drawer v-else v-model:open="isOpen">
    <DrawerTrigger as-child>
      <TriggerComponent />
    </DrawerTrigger>
    <DrawerContent class="h-[500px]">
      <FilterComponent />
    </DrawerContent>
  </Drawer>
</template>
