<script setup>
const route = useRoute()
</script>

<template>
  <section class="flex justify-between">
    <Tabs
      v-if="route.path !== '/admin/link'"
      :default-value="route.path"
      @update:model-value="navigateTo"
    >
      <TabsList>
        <TabsTrigger
          value="/admin/links"
        >
          {{ $t('nav.links') }}
        </TabsTrigger>
        <TabsTrigger value="/admin/analysis">
          {{ $t('nav.analysis') }}
        </TabsTrigger>
        <TabsTrigger value="/admin/realtime">
          {{ $t('nav.realtime') }}
        </TabsTrigger>
      </TabsList>
    </Tabs>
    <slot name="left" />
    <div>
      <slot />
    </div>
  </section>
</template>
