# Plan for Restructuring the Project

**Goal:** Move the entire Nuxt application from the `Sink` subdirectory to the root of the repository to follow standard project conventions and simplify the development workflow.

---

### **Step 0: Pre-move checklist (required)**

- Create a feature branch: `git checkout -b chore/repo-restructure`
- Identify and plan to merge these to the repo root (merge, don’t overwrite):
  - `package.json`, `pnpm-lock.yaml`, `nuxt.config.ts`, `tsconfig.json`, `tailwind.config.js`, ESLint/Vitest configs, `wrangler.jsonc`/`wrangler.toml`, `.env`, `.env.example`, and dirs: `app/`, `public/`, `server/`, `tests/`, `scripts/`
- Update Wrangler config for root (confirm after build): `main = ".output/server/index.mjs"`, `compatibility_date`, flags.
- Audit package.json scripts/imports for `Sink/` path assumptions; they will be root-relative after the move.
- Ensure `.github/workflows` is at root; plan to remove `working-directory: ./Sink` and update cache keys if any.
- Baseline build before moving: `cd Sink && pnpm install && pnpm build`.
- Use `git mv` to preserve history (including dotfiles):

  - `git mv Sink/* .`
  - `git mv -k Sink/.* . 2> NUL` (ignore errors for `.`/`..`)

---

### **Step 1: Move Application Files to Root**

This step involves moving all files and folders from the `Sink` directory to the project root.

**Instructions for Cursor:**

1.  Move all contents (including hidden files) from `C:\Users\mate0\Desktop\AVANTA DESIGN CODE\avanta-sink\Sink` to the project root at `C:\Users\mate0\Desktop\AVANTA DESIGN CODE\avanta-sink`.
2.  After moving, the `Sink` directory should be empty. You can then delete it.

### **Step 1.5: Verify moved configs and paths**

After moving files, update and verify:
- package.json scripts: remove `cd Sink` or path prefixes; ensure `build`, `dev`, `preview`, `test` work at root.
- Nuxt: `nuxt.config.ts` asset and alias paths; public/ and .output references.
- Wrangler: run `pnpm build` once, then `npx wrangler deploy --dry-run` to validate it finds `.output/server/index.mjs` and bindings.
- ESLint/Vitest config root paths, test globs, and coverage output dirs.

---

---

### **Step 2: Update GitHub Actions Workflow**

The CI/CD pipeline needs to be updated to run commands from the root directory.

**File to Edit:** `.github/workflows/deploy.yml`

**Instructions for Cursor:**

Replace the entire content of `.github/workflows/deploy.yml` with the following code. This version removes the `working-directory: ./Sink` parameter from all relevant jobs.

**New `deploy.yml` Content:**

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10.11.0
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Build application
        run: pnpm run build
        env:
          NODE_OPTIONS: --max-old-space-size=8192
          NUXT_SITE_TOKEN: ${{ secrets.NUXT_SITE_TOKEN }}
          NUXT_CF_ACCOUNT_ID: ${{ secrets.NUXT_CF_ACCOUNT_ID }}
### **Step 4: Validation & rollout**

1. Commit and push branch; open PR.
2. Ensure CI passes on PR (install, build, lint, test, deploy dry-run or preview).
3. Manual local checks at repo root:
   - `pnpm dev` starts
   - `pnpm build` creates `.output`
   - `npx wrangler deploy --dry-run` succeeds
4. Merge PR after approvals; monitor production after first deploy.
5. If issues, rollback by reverting PR (keeps history clean).

---

          NUXT_CF_API_TOKEN: ${{ secrets.NUXT_CF_API_TOKEN }}
          NUXT_DATASET: ${{ secrets.NUXT_DATASET }}
          
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy
          
      - name: Comment deployment URL on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🚀 Deployment successful! Preview URL will be available in Cloudflare Workers dashboard.'
            })
```

---

### **Step 3: Clean Up Root Directory**

Move miscellaneous files from the root into a new `archive` folder to keep the project tidy.

**Instructions for Cursor:**

1.  Create a new directory named `archive` in the project root (`C:\Users\mate0\Desktop\AVANTA DESIGN CODE\avanta-sink\archive`).
2.  Move the following files into the new `archive` directory:
    *   `Avanta Design.html`
    *   `T2M-URLs-2025-10-11-033321.csv`
    *   `SINK_IMPLEMENTATION_PLAN.md`

---

After completing these steps, the project will have a standard structure, making it easier to manage.