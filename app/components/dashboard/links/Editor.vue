<script setup>
import { LinkSchema, nanoid } from '@@/schemas/link'
import { toTypedSchema } from '@vee-validate/zod'
import { Shuffle, Sparkles } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import { DependencyType } from '@/components/ui/auto-form/interface'

const props = defineProps({
  link: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:link'])

const { t } = useI18n()
const link = ref(props.link)
const dialogOpen = ref(false)

const isEdit = !!props.link.id

const EditLinkSchema = LinkSchema.pick({
  url: true,
  slug: true,
}).extend({
  optional: LinkSchema.omit({
    id: true,
    url: true,
    slug: true,
    createdAt: true,
    updatedAt: true,
    title: true,
    description: true,
    image: true,
  }).extend({
    expiration: z.coerce.date().optional(),
  }).optional(),
})

const fieldConfig = {
  slug: {
    disabled: isEdit,
  },
  optional: {
    comment: {
      component: 'textarea',
    },
    password: {
      inputProps: {
        type: 'password',
        placeholder: 'Optional password protection',
      },
    },
    utm_source: {
      label: 'UTM Source',
      inputProps: {
        placeholder: 'e.g., newsletter, twitter',
      },
    },
    utm_medium: {
      label: 'UTM Medium',
      inputProps: {
        placeholder: 'e.g., email, social',
      },
    },
    utm_campaign: {
      label: 'UTM Campaign',
      inputProps: {
        placeholder: 'e.g., summer_sale',
      },
    },
    utm_term: {
      label: 'UTM Term',
      inputProps: {
        placeholder: 'e.g., keyword',
      },
    },
    utm_content: {
      label: 'UTM Content',
      inputProps: {
        placeholder: 'e.g., logo_link',
      },
    },
    og_title: {
      label: 'OG Title',
      description: 'Custom Open Graph title for social media previews',
      inputProps: {
        placeholder: 'Override the default title',
      },
    },
    og_description: {
      label: 'OG Description',
      description: 'Custom Open Graph description for social media previews',
      component: 'textarea',
      inputProps: {
        placeholder: 'Override the default description',
      },
    },
    og_image: {
      label: 'OG Image URL',
      description: 'Custom Open Graph image URL for social media previews',
      inputProps: {
        type: 'url',
        placeholder: 'https://example.com/image.jpg',
      },
    },
    expirationClicks: {
      label: 'Expire After Clicks',
      description: 'Link will expire after this many clicks',
      inputProps: {
        type: 'number',
        placeholder: 'e.g., 100',
        min: 1,
      },
    },
  },
}

const dependencies = [
  {
    sourceField: 'slug',
    type: DependencyType.DISABLES,
    targetField: 'slug',
    when: () => isEdit,
  },
]

const form = useForm({
  validationSchema: toTypedSchema(EditLinkSchema),
  initialValues: {
    slug: link.value.slug,
    url: link.value.url,
    optional: {
      comment: link.value.comment,
      password: link.value.password,
      utm_source: link.value.utm_source,
      utm_medium: link.value.utm_medium,
      utm_campaign: link.value.utm_campaign,
      utm_term: link.value.utm_term,
      utm_content: link.value.utm_content,
      og_title: link.value.og_title,
      og_description: link.value.og_description,
      og_image: link.value.og_image,
      expirationClicks: link.value.expirationClicks,
    },
  },
  validateOnMount: isEdit,
  keepValuesOnUnmount: isEdit,
})

function randomSlug() {
  form.setFieldValue('slug', nanoid()())
}

const aiSlugPending = ref(false)
async function aiSlug() {
  if (!form.values.url)
    return

  aiSlugPending.value = true
  try {
    const { slug } = await useAPI('/api/link/ai', {
      query: {
        url: form.values.url,
      },
    })
    form.setFieldValue('slug', slug)
  }
  catch (error) {
    console.log(error)
  }
  aiSlugPending.value = false
}

onMounted(() => {
  if (link.value.expiration) {
    form.setFieldValue('optional.expiration', unix2date(link.value.expiration))
  }
})

async function onSubmit(formData) {
  try {
    const link = {
      url: formData.url,
      slug: formData.slug,
      ...(formData.optional || []),
      expiration: formData.optional?.expiration ? date2unix(formData.optional?.expiration, 'end') : undefined,
    }
    const { link: newLink } = await useAPI(isEdit ? '/api/link/edit' : '/api/link/create', {
      method: isEdit ? 'PUT' : 'POST',
      body: link,
    })
    dialogOpen.value = false
    emit('update:link', newLink, isEdit ? 'edit' : 'create')
    if (isEdit) {
      toast.success(t('links.update_success'))
    }
    else {
      toast.success(t('links.create_success'))
    }
  }
  catch (error) {
    console.error('Failed to save link:', error)
    toast.error(isEdit ? 'Failed to update link' : 'Failed to create link')
  }
}

const { previewMode } = useRuntimeConfig().public

// Computed property for short URL preview
const shortUrlPreview = computed(() => {
  const slug = form.values.slug
  if (!slug)
    return ''
  return `${location.origin}/${slug}`
})
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogTrigger as-child>
      <slot>
        <Button
          class="ml-2"
          variant="outline"
          @click="randomSlug"
        >
          {{ $t('links.create') }}
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="max-w-[95svw] max-h-[95svh] md:max-w-lg grid-rows-[auto_minmax(0,1fr)_auto]">
      <DialogHeader>
        <DialogTitle>{{ link.id ? $t('links.edit') : $t('links.create') }}</DialogTitle>
      </DialogHeader>
      <p
        v-if="previewMode"
        class="text-sm text-muted-foreground"
      >
        {{ $t('links.preview_mode_tip') }}
      </p>
      <AutoForm
        class="overflow-y-auto px-2 space-y-2"
        :schema="EditLinkSchema"
        :form="form"
        :field-config="fieldConfig"
        :dependencies="dependencies"
        @submit="onSubmit"
      >
        <template #slug="slotProps">
          <div
            v-if="!isEdit"
            class="relative"
          >
            <div class="flex absolute right-0 top-1 space-x-3">
              <Shuffle
                class="w-4 h-4 cursor-pointer"
                @click="randomSlug"
              />
              <Sparkles
                class="w-4 h-4 cursor-pointer"
                :class="{ 'animate-bounce': aiSlugPending }"
                @click="aiSlug"
              />
            </div>
            <AutoFormField
              v-bind="slotProps"
            />
            <div
              v-if="shortUrlPreview"
              class="mt-2 p-2 text-sm text-muted-foreground bg-muted rounded-md border border-border"
            >
              <span class="font-medium">{{ $t('links.preview') }}: </span>
              <span class="break-all">{{ shortUrlPreview }}</span>
            </div>
          </div>
        </template>
        <DialogFooter>
          <DialogClose as-child>
            <Button
              type="button"
              variant="secondary"
              class="mt-2 sm:mt-0"
            >
              {{ $t('common.close') }}
            </Button>
          </DialogClose>
          <Button type="submit">
            {{ $t('common.save') }}
          </Button>
        </DialogFooter>
      </AutoForm>
    </DialogContent>
  </Dialog>
</template>
