# Link Truncation and Icon Correction Plan

This plan outlines the steps to fix two issues in the dashboard:
1. Original links not being truncated correctly within their display boxes.
2. Icons on the top right of some link boxes not working as expected.

## 1. Fix Link Truncation

### Analysis
The root cause of the truncation issue is likely missing or incorrect CSS properties on the elements that display the original link. The text is overflowing its container instead of being truncated with an ellipsis.

### Steps
1.  **Identify the Component:** Locate the Vue component responsible for rendering the individual link boxes in the dashboard. Based on the file structure, this is likely a component within `app/components/dashboard/analysis/links/`.
2.  **Inspect the CSS:** Examine the CSS styles applied to the link display element.
3.  **Apply Truncation Styles:** Add the following CSS properties to the appropriate class to ensure text truncation:
    ```css
    .link-class { /* Replace with the actual class name */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    ```

## 2. Fix Incorrect Icons

### Analysis
The problem with the icons could be due to a few reasons:
*   The conditional logic for displaying the icon is incorrect.
*   The icon component itself has a bug.
*   The data used to determine which icon to show is incorrect or missing for some links.

### Steps
1.  **Locate Icon Logic:** Find the code within the link box component that is responsible for rendering the top-right icon.
2.  **Debug the Logic:**
    *   Examine the props or data being passed to the icon component.
    *   Check the `v-if` or other conditional rendering logic that determines which icon to display.
    *   Use browser developer tools to inspect the component's state and props for the problematic link boxes.
3.  **Correct the Implementation:** Based on the debugging, correct the conditional logic or the data being passed to ensure the right icon is displayed for all link types.
