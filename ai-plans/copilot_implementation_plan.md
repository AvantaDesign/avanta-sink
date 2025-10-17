# GitHub Copilot: Avanta Design URL Shortener Implementation Plan

This document provides a detailed, step-by-step guide for GitHub Copilot to implement new features and improvements for the Avanta Design URL Shortener.

**Your task is to follow these instructions precisely, executing each step in the specified order to ensure a successful implementation.**

---

## Feature 1: Enhanced Dashboard Functionality

### Part 1.1: Bulk Link Deletion

**Goal:** Allow users to select multiple links from the dashboard and delete them in a single action.

1.  **File to Modify:** `app/components/dashboard/analysis/links/Table.vue`
    - **Add Checkbox State:** In the `<script setup>` section, add a new `ref` to store the IDs of the selected links.
      ```typescript
      const selectedLinks = ref<string[]>([])
      ```
    - **Add "Select All" Checkbox:** In the `<thead>` of the table, add a checkbox in the first `<th>`. This checkbox's state should be bound to a computed property that checks if all visible links are selected. When clicked, it should call a method that either selects or deselects all links.
    - **Add Row Checkboxes:** In the `<tbody>`, add a checkbox to the first cell of each row (`<td>`). Bind its `v-model` to the `selectedLinks` array, using the `link.id` as the value.
    - **Add "Delete Selected" Button:** Add a button to the dashboard's action bar. It should be disabled if `selectedLinks.length === 0`. When clicked, it should trigger a confirmation dialog.
    - **Implement Delete Logic:** On confirmation, call a new function that makes a `POST` request to a new API endpoint: `/api/link/bulk-delete`. The request body should contain the `selectedLinks` array. After a successful response, clear the `selectedLinks` array and refresh the link list.

2.  **File to Create:** `server/api/link/bulk-delete.post.ts`
    - **Create API Endpoint:** This endpoint will handle the bulk deletion logic.
    - **Read Request Body:** Get the array of link IDs from the request body.
    - **Validate Input:** Ensure the request body contains an array of strings.
    - **Delete from KV:** Use the `useDB()` utility to access the Cloudflare KV namespace. Iterate through the array of link IDs and delete each one from the KV store.
    - **Return Response:** Return a 200 status code on success or an appropriate error code on failure.

### Part 1.2: Advanced Filtering and Sorting

**Goal:** Implement more powerful filtering and sorting options for the links table.

1.  **File to Modify:** `app/components/dashboard/analysis/links/Table.vue`
    - **Add Sorting UI:** In the table headers (`<th>`) for "Clicks," "Creation Date," and "Last Modified," add buttons or icons that allow the user to sort the table by that column in ascending or descending order.
    - **Add Filtering UI:** Add new filter controls to the dashboard's action bar (likely in `app/components/dashboard/Filters.vue`). These should include:
      - A date range picker for "Creation Date."
      - A dropdown for filtering by tags (this will require implementing a tagging system first, see Feature 4).
    - **Implement Logic:**
      - Create `ref`s to hold the current sort key and sort order.
      - Create a `computed` property that takes the original list of links and applies the current sorting and filtering criteria.
      - Use this new computed property as the source for your `v-for` loop in the table.

---

## Feature 2: Improved Link Creation Flow

### Part 2.1: Fix QR Code Color Generation

**Goal:** Fix the bug where changing the QR code color also changes the QR code's data/type.

1.  **File to Modify:** (Likely) The Vue component responsible for QR code generation. Please locate the component that uses the `qr-code-styling` library.
    - **Isolate the Bug:** The issue is likely that the entire options object for `qr-code-styling` is being re-created when the color changes, which may cause the `data` property to be reset or re-evaluated incorrectly.
    - **Apply the Fix:** Ensure that when the color is updated, you are only updating the `dotsOptions.color` or `backgroundOptions.color` properties of the existing QR code instance, rather than creating a new instance from scratch. Use the `update` method of the `qr-code-styling` instance if available.

### Part 2.2: Real-time Link Preview

**Goal:** Show the user a preview of their final short URL as they type.

1.  **File to Modify:** The component for creating/editing links (e.g., `app/components/dashboard/LinkEditor.vue` if it exists, or the relevant modal/form).
    - **Add Preview Element:** Add a text element or a disabled input field below the "slug" input field.
    - **Create Computed Property:** Create a `computed` property that concatenates the site's domain with the value of the slug input. For example: `https://avanta.design/{slug}`.
    - **Bind to Preview:** Bind the text of the preview element to this computed property.

### Part 2.3: Social Media Previews (Open Graph) & Image Storage

**Goal:** Allow users to set custom Open Graph tags for social media previews and upload a custom image.

1.  **File to Modify:** The link creation/editing form.
    - **Add New Fields:** Add input fields for `og:title`, `og:description`, and an image uploader for `og:image`.
    - **Update Save Logic:** When the link is saved, include these new fields in the data sent to the API.

2.  **File to Create:** `server/api/image/upload.post.ts`
    - **Create API Endpoint:** This endpoint will handle image uploads.
    - **Use Cloudflare Images:** Since the project is on Cloudflare, use **Cloudflare Images** to store the uploaded `og:image`. This is a cost-effective solution with a generous free tier.
    - **Logic:** The endpoint should receive the image, upload it to Cloudflare Images, and return the resulting image URL.

3.  **File to Modify:** `server/middleware/1.redirect.ts`
    - **Update Redirect Logic:** When a short link is visited, check if it has custom Open Graph tags.
    - **If Custom Tags Exist:** Instead of an immediate 302 redirect, return a dynamically generated HTML page that contains the custom `og:title`, `og:description`, and `og:image` meta tags, along with a JavaScript-based redirect to the final destination URL.
    - **If No Custom Tags:** Perform the standard 302 redirect as it currently does.

---

## Feature 3: General UI Polish

### Part 3.1: Improved Notifications

**Goal:** Provide clear, consistent feedback for user actions.

1.  **Files to Modify:** All components that perform actions (e.g., creating, updating, deleting links; copying URLs).
    - **Integrate `vue-sonner`:** The library is already installed. Use the `toast()` function to display notifications.
    - **Success Toasts:** On successful API calls (e.g., after creating a link), show a success toast: `toast.success('Link created successfully!')`.
    - **Error Toasts:** In your `catch` blocks for API calls, show an error toast: `toast.error('An error occurred.')`.
    - **Informational Toasts:** For actions like copying a URL to the clipboard, show an info toast: `toast.info('Copied to clipboard')`.

### Part 3.2: Empty States

**Goal:** Improve the UI for when no data is available.

1.  **File to Modify:** `app/components/dashboard/analysis/links/Table.vue`
    - **Add Empty State:** Use a `v-if` to check if the links array is empty. If it is, hide the table and show a visually appealing "empty state" component instead. This component should have a message like "No links yet. Create your first one!" and a button that opens the link creation modal.

---

## Feature 4: Advanced Link Features

### Part 4.1: Link Expiration

**Goal:** Allow links to expire after a set date or a certain number of clicks.

1.  **File to Modify:** The link creation/editing form.
    - **Add Expiration Fields:** Add two new optional fields:
      - A date/time picker for "Expiration Date."
      - A number input for "Expire after X clicks."
    - **Update Save Logic:** Include these new fields in the data sent to the API when saving a link.

2.  **File to Modify:** `server/middleware/1.redirect.ts`
    - **Add Expiration Check:** When a link is visited, before performing the redirect, check for expiration conditions:
      - **Date:** Is the current date past the expiration date?
      - **Clicks:** Does the link have a click limit, and has it been reached?
    - **Handle Expired Links:** If a link is expired, redirect to a dedicated "Link Expired" page instead of the destination URL.

### Part 4.2: Password Protection

**Goal:** Require a password to access a short link's destination.

1.  **File to Modify:** The link creation/editing form.
    - **Add Password Field:** Add an optional password input field.

2.  **File to Modify:** `server/middleware/1.redirect.ts`
    - **Add Password Check:** When a link is visited, check if it is password-protected.
    - **If Protected:** Redirect the user to a password entry page. Do not proceed to the destination URL.

3.  **File to Create:** `app/pages/protected/[slug].vue`
    - **Create Password Page:** This page will have a password input field. When the user submits the password, it will be sent to a new API endpoint for verification.

4.  **File to Create:** `server/api/verify-password.post.ts`
    - **Create Verification Endpoint:** This endpoint will receive a link slug and a password. It will check if the password is correct for the given link. If it is, it can return the destination URL or a token that the frontend can use to perform the final redirect.

### Part 4.3: UTM Builder

**Goal:** Help users build UTM parameters for their links.

1.  **File to Modify:** The link creation/editing form.
    - **Add UTM Builder UI:** Add a new section or a modal with fields for standard UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`).
    - **Update Destination URL:** As the user fills in the UTM fields, dynamically append the generated UTM query string to the destination URL.
