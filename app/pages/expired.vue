<script setup>
definePageMeta({
  layout: false,
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background">
    <div class="mx-auto max-w-md space-y-6 text-center px-4">
      <div class="text-6xl">
        ⏰
      </div>
      <h1 class="text-3xl font-bold tracking-tight">
        Link Expired
      </h1>
      <p class="text-muted-foreground">
        This link has expired and is no longer available. Please contact the link owner for an updated link.
      </p>
      <div class="pt-6">
        <NuxtLink to="/">
          <Button size="lg">
            Go to Homepage
          </Button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
