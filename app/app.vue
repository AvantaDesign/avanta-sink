<script setup>
const { title, description, image } = useAppConfig()

useSeoMeta({
  title: `${title} - ${description}`,
  description,
  ogType: 'website',
  ogTitle: title,
  ogSiteName: title,
  ogDescription: description,
  ogImage: image,
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: image,
  twitterCard: 'summary_large_image',
})

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
      tagPosition: 'head',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/webp',
      href: '/newicons/Isotipo Avanta Gradient_ICON_WEB.webp',
    },
    {
      rel: 'apple-touch-icon',
      href: '/newicons/Isotipo Avanta Gradient_ICON_WEB.webp',
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="hsl(18 96% 58%)" />
    <NuxtPage />
    <Toaster />
  </NuxtLayout>
</template>
