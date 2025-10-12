# Routing Fix Plan

**Goal:** Fix the 404 errors when navigating the dashboard menu.

---

### **Problem Description**

When clicking on menu items in the dashboard (e.g., "Links", "Analysis", "Realtime"), the application navigates to a 404 page. This is because the navigation links point to `/dashboard/*` routes, but the actual pages are located under the `/admin/*` path.

While there are redirects configured in `nuxt.config.ts` from `/dashboard` to `/admin`, these are not being triggered correctly by the client-side navigation used in the menu component.

### **Solution**

The solution is to update the paths in the dashboard navigation component (`app/components/dashboard/Nav.vue`) to point directly to the correct `/admin/*` routes.

---

### **Step 1: Edit the Navigation Component**

**File to Edit:** `app/components/dashboard/Nav.vue`

**Instructions:**

1.  Open the file `app/components/dashboard/Nav.vue`.
2.  Update the `value` attributes of the `TabsTrigger` components to use the `/admin` prefix instead of `/dashboard`.
3.  Update the `v-if` condition to check for the correct `/admin/link` path.

**Replace this code:**

```vue
<script setup>
const route = useRoute()
</script>

<template>
  <section class="flex justify-between">
    <Tabs
      v-if="route.path !== '/dashboard/link'"
      :default-value="route.path"
      @update:model-value="navigateTo"
    >
      <TabsList>
        <TabsTrigger
          value="/dashboard/links"
        >
          {{ $t('nav.links') }}
        </TabsTrigger>
        <TabsTrigger value="/dashboard/analysis">
          {{ $t('nav.analysis') }}
        </TabsTrigger>
        <TabsTrigger value="/dashboard/realtime">
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
```

**With this code:**

```vue
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
```
