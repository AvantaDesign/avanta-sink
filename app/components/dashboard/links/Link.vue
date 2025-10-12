<script setup>
import { useClipboard } from '@vueuse/core'
import { CalendarPlus2, Copy, CopyCheck, Eraser, Hourglass, Link as LinkIcon, QrCode, SquareChevronDown, SquarePen } from 'lucide-vue-next'
import { parseURL } from 'ufo'
import { toast } from 'vue-sonner'
import QRCode from './QRCode.vue'

const props = defineProps({
  link: {
    type: Object,
    required: true,
  },
  selectedLinks: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['update:link', 'update:selectedLinks'])

const { t } = useI18n()
const editPopoverOpen = ref(false)

const { host, origin } = location

function getLinkHost(url) {
  const { host } = parseURL(url)
  return host
}

const shortLink = computed(() => `${origin}/${props.link.slug}`)
const linkIcon = computed(() => `https://unavatar.io/${getLinkHost(props.link.url)}?fallback=https://sink.cool/icon.png`)

const { copy, copied } = useClipboard({ source: shortLink.value, copiedDuring: 400 })

function updateLink(link, type) {
  emit('update:link', link, type)
  editPopoverOpen.value = false
}

function copyLink() {
  copy(shortLink.value)
  toast(t('links.copy_success'))
}

const isSelected = computed(() => props.selectedLinks.includes(props.link.slug))

function toggleSelection() {
  const newSelectedLinks = [...props.selectedLinks]
  if (isSelected.value) {
    const index = newSelectedLinks.indexOf(props.link.slug)
    newSelectedLinks.splice(index, 1)
  } else {
    newSelectedLinks.push(props.link.slug)
  }
  emit('update:selectedLinks', newSelectedLinks)
}
</script>

<template>
  <Card>
    <div class="flex flex-col p-4 space-y-3">
      <div class="flex items-center justify-between">
        <Checkbox 
          :checked="isSelected" 
          @update:checked="toggleSelection"
          class="mr-2"
        />
        <NuxtLink
          class="flex flex-col flex-1 space-y-3"
          :to="`/admin/link?slug=${link.slug}`"
        >
          <div class="flex items-center justify-center space-x-3">
        <Avatar>
          <AvatarImage
            :src="linkIcon"
            alt="@radix-vue"
            loading="lazy"
          />
          <AvatarFallback>
            <img
              src="/icon.png"
              alt="Sink"
              loading="lazy"
            >
          </AvatarFallback>
        </Avatar>

        <div class="flex-1 overflow-hidden">
          <div class="flex items-center justify-between">
            <div class="flex items-center flex-1 min-w-0">
              <div class="font-bold leading-5 truncate text-md">
                {{ link.comment || link.title || link.description }}
              </div>

              <CopyCheck
                v-if="copied"
                class="w-4 h-4 ml-1 shrink-0"
                @click.prevent
              />
              <Copy
                v-else
                class="w-4 h-4 ml-1 shrink-0"
                @click.prevent="copyLink"
              />
            </div>

            <div class="flex items-center gap-2 ml-2 shrink-0">
              <a
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                @click.stop
              >
                <LinkIcon class="w-5 h-5" />
              </a>

              <Popover>
                <PopoverTrigger>
                  <QrCode
                    class="w-5 h-5"
                    @click.prevent
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <QRCode
                    :data="shortLink"
                    :image="'/newicons/Isotipo Avanta Gradient_ICON_WEB.webp'"
                  />
                </PopoverContent>
              </Popover>

              <Popover v-model:open="editPopoverOpen">
                <PopoverTrigger>
                  <SquareChevronDown
                    class="w-5 h-5"
                    @click.prevent
                  />
                </PopoverTrigger>
                <PopoverContent
                  class="w-auto p-0"
                  :hide-when-detached="false"
                >
                  <DashboardLinksEditor
                    :link="link"
                    @update:link="updateLink"
                  >
                    <div
                      class="cursor-pointer flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    >
                      <SquarePen
                        class="w-5 h-5 mr-2"
                      />
                      {{ $t('common.edit') }}
                    </div>
                  </DashboardLinksEditor>

                  <Separator />

                  <DashboardLinksDelete
                    :link="link"
                    @update:link="updateLink"
                  >
                    <div
                      class="cursor-pointer flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    >
                      <Eraser
                        class="w-5 h-5 mr-2"
                      /> {{ $t('common.delete') }}
                    </div>
                  </DashboardLinksDelete>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <p class="text-sm truncate text-muted-foreground">
                  {{ host }}/{{ link.slug }}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p class="max-w-[90svw] break-all">
                  {{ host }}/{{ link.slug }}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
      </div>
      <div class="flex w-full h-5 space-x-2 text-sm">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <span class="inline-flex items-center leading-5 whitespace-nowrap"><CalendarPlus2 class="w-4 h-4 mr-1" /> {{ shortDate(link.createdAt) }}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Created At: {{ longDate(link.createdAt) }}</p>
              <p>Updated At: {{ longDate(link.updatedAt) }}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <template v-if="link.expiration">
          <Separator orientation="vertical" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <span class="inline-flex items-center leading-5 whitespace-nowrap"><Hourglass class="w-4 h-4 mr-1" /> {{ shortDate(link.expiration) }}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Expires At: {{ longDate(link.expiration) }}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </template>
        <Separator orientation="vertical" />
        <span class="truncate">{{ link.url }}</span>
      </div>
        </NuxtLink>
      </div>
    </div>
  </Card>
</template>
