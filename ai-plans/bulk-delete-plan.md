# Bulk Delete Feature Plan

**Goal:** Allow users to select multiple links in the dashboard and delete them in a single action.

---

### **Overview**

This feature will be implemented by adding checkboxes to the link list for multi-selection, a "Delete Selected" button, and a new backend API endpoint to handle the bulk deletion.

---

### **Part 1: Backend Changes**

#### **Step 1.1: Create a New API Endpoint for Bulk Deletion**

Create a new file `server/api/link/bulk-delete.post.ts` to handle the deletion of multiple links.

**File to Create:** `server/api/link/bulk-delete.post.ts`

**Content:**

```typescript
export default eventHandler(async (event) => {
  const { previewMode } = useRuntimeConfig(event).public
  if (previewMode) {
    throw createError({
      status: 403,
      statusText: 'Preview mode cannot delete links.',
    })
  }

  const { slugs } = await readBody(event)

  if (slugs && Array.isArray(slugs)) {
    const { cloudflare } = event.context
    const { KV } = cloudflare.env

    const promises = slugs.map(slug => KV.delete(`link:${slug}`))
    await Promise.all(promises)

    return { success: true }
  }

  throw createError({
    status: 400,
    statusText: 'Invalid request body. Expected an array of slugs.',
  })
})
```

---

### **Part 2: Frontend Changes**

For the frontend, we'll assume there is a main component that lists the links (e.g., `app/components/dashboard/links/index.vue`) and a child component for each link (e.g., `LinkCard.vue`).

#### **Step 2.1: Update the Link List Component**

**File to Edit:** `app/components/dashboard/links/index.vue` (or the actual component that lists the links)

**Instructions:**

1.  **Add state for selected links:**
    ```javascript
    const selectedLinks = ref([])
    ```

2.  **Add a "Delete Selected" button:**
    ```html
    <Button :disabled="selectedLinks.length === 0" @click="bulkDelete">
      Delete Selected
    </Button>
    ```

3.  **Create the `bulkDelete` method:**
    ```javascript
    async function bulkDelete() {
      try {
        await $fetch('/api/link/bulk-delete', {
          method: 'POST',
          body: { slugs: selectedLinks.value },
        })
        selectedLinks.value = []
        // Add logic to refresh the list of links here
      } catch (error) {
        console.error('Failed to delete links:', error)
      }
    }
    ```

4.  **Pass down the selection state to the child component:**
    When rendering the list of links, pass the `selectedLinks` array and an event handler to update it.

#### **Step 2.2: Update the Single Link Component**

**File to Edit:** `LinkCard.vue` (or the actual component for a single link)

**Instructions:**

1.  **Add a checkbox:**
    ```html
    <Checkbox :checked="isSelected" @update:checked="toggleSelection" />
    ```

2.  **Define props to receive the selection state:**
    ```javascript
    const props = defineProps({
      link: Object,
      selectedLinks: Array,
    })

    const emit = defineEmits(['update:selectedLinks'])
    ```

3.  **Add computed property and method for selection:**
    ```javascript
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
    ```
