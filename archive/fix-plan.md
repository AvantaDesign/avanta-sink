# Deployment Fix Plan

**Goal:** Resolve the `ERR_PNPM_NO_LOCKFILE` error during deployment by aligning pnpm versions.

---

### **Step 1: Update `package.json`**

Update the `packageManager` field to a newer pnpm version.

**File to Edit:** `package.json`

**Instructions:**

1.  Locate the `packageManager` field.
2.  Change its value from `pnpm@10.11.0` to `pnpm@10.18.2`.

---

### **Step 2: Update GitHub Actions Workflow**

Update the pnpm version in the deployment workflow to match `package.json`.

**File to Edit:** `.github/workflows/deploy.yml`

**Instructions:**

1.  Find the "Setup pnpm" step.
2.  Change the `version` from `10.11.0` to `10.18.2`.

---

### **Step 3: Regenerate Lockfile**

After applying the changes in the previous steps, run the following command in the terminal to regenerate the `pnpm-lock.yaml` file:

```bash
pnpm install
```

---

### **Step 4: Commit Changes**

Commit the following modified files to your git repository:

*   `package.json`
*   `.github/workflows/deploy.yml`
*   `pnpm-lock.yaml`
