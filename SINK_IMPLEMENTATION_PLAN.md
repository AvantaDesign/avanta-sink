
# AVANTA DESIGN URL SHORTENER MIGRATION
## Complete Step-by-Step Implementation Plan

**Project:** Migrate from T2M to self-hosted Sink URL Shortener on Cloudflare
**Domain:** avanta.design
**Links to Migrate:** 87 existing T2M links
**Timeline:** 2-4 hours total

---

## PHASE 1: PREREQUISITES & SETUP (30 minutes)

### Step 1.1: Verify System Requirements
**Action:** Ensure the following are installed on your local machine
- [ ] Node.js v18+ (`node --version`)
- [ ] npm v9+ (`npm --version`)
- [ ] Git (`git --version`)

**Cursor Instructions:**
```bash
# Check versions
node --version  # Should be v18 or higher
npm --version   # Should be v9 or higher
git --version   # Any recent version
```

**If not installed:**
- Download Node.js from: https://nodejs.org/ (LTS version)
- Git from: https://git-scm.com/downloads

---

### Step 1.2: Install Cloudflare Wrangler CLI
**Action:** Install Cloudflare's development tool globally

**Cursor Instructions:**
```bash
npm install -g wrangler
```

**Verify installation:**
```bash
wrangler --version
```

**Expected Output:** Should show version 3.x or higher

---

### Step 1.3: Authenticate with Cloudflare
**Action:** Log into Cloudflare account via Wrangler

**Cursor Instructions:**
```bash
wrangler login
```

**What happens:**
- Browser window will open
- Log in with Cloudflare credentials for the account managing avanta.design
- Grant permissions to Wrangler
- Return to terminal after success message

**Verification:**
```bash
wrangler whoami
```

**Expected Output:** Should show the authenticated Cloudflare account email

---

## PHASE 2: SINK INSTALLATION (30 minutes)

### Step 2.1: Clone Sink Repository
**Action:** Download Sink source code from GitHub

**Cursor Instructions:**
```bash
# Navigate to your projects directory
cd ~/projects  # Or wherever you keep projects

# Clone the repository
git clone https://github.com/ccbikai/Sink.git

# Enter the project directory
cd Sink
```

**Verification:**
```bash
ls -la
# Should show: package.json, nuxt.config.ts, wrangler.toml, etc.
```

---

### Step 2.2: Install Dependencies
**Action:** Install all required npm packages

**Cursor Instructions:**
```bash
npm install
```

**Expected:** Installation completes without errors (may show some warnings - ignore those)

---

### Step 2.3: Configure Environment Variables
**Action:** Set up secure authentication token and site configuration

**Cursor Instructions:**
```bash
# Create .env file
touch .env

# Open .env in your editor and add:
```

**File: `.env`**
```env
# Security token for dashboard access (choose a strong password)
NUXT_SITE_TOKEN=your_secure_token_here_min_32_characters

# Optional: Site name
NUXT_SITE_NAME=Avanta Design Links

# Optional: Site description
NUXT_SITE_DESCRIPTION=Avanta Design URL Shortener
```

**Important:** Replace `your_secure_token_here_min_32_characters` with a strong random string.

**Generate secure token (run this):**
```bash
# Mac/Linux
openssl rand -base64 32

# Windows (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

---

### Step 2.4: Update Wrangler Configuration
**Action:** Configure Cloudflare Workers settings

**Cursor Instructions:**
Open `wrangler.toml` and verify/update:

**File: `wrangler.toml`**
```toml
name = "avanta-shortener"
main = ".output/server/index.mjs"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[observability]
enabled = true

# Analytics Engine binding
[[analytics_engine_datasets]]
binding = "ANALYTICS"

# KV namespace for storing short URLs
[[kv_namespaces]]
binding = "KV"
id = ""  # Will be created in next step
```

---

### Step 2.5: Create Cloudflare KV Namespace
**Action:** Create storage for URL mappings

**Cursor Instructions:**
```bash
# Create production KV namespace
wrangler kv:namespace create "KV"
```

**Expected Output:**
```
🌀  Creating namespace with title "avanta-shortener-KV"
✨  Success!
Add the following to your wrangler.toml:
[[kv_namespaces]]
binding = "KV"
id = "1234567890abcdef1234567890abcdef"
```

**Action:** Copy the `id` value and update `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "KV"
id = "1234567890abcdef1234567890abcdef"  # Use YOUR actual ID
```

---

## PHASE 3: INITIAL DEPLOYMENT (20 minutes)

### Step 3.1: Build the Application
**Action:** Compile Sink for production

**Cursor Instructions:**
```bash
npm run build
```

**Expected:** Build completes successfully, creates `.output` directory

---

### Step 3.2: Deploy to Cloudflare Workers
**Action:** Upload application to Cloudflare

**Cursor Instructions:**
```bash
npx wrangler deploy
```

**Expected Output:**
```
✨  Compiled Worker successfully
⛅️  Successfully published your Worker
🌍  https://avanta-shortener.YOURSUBDOMAIN.workers.dev
```

**Verification:**
- Copy the workers.dev URL
- Open it in a browser
- Should see Sink's welcome page

---

### Step 3.3: Set Environment Variables in Production
**Action:** Configure production secrets

**Cursor Instructions:**
```bash
# Set the site token (use the same one from .env)
wrangler secret put NUXT_SITE_TOKEN

# When prompted, paste your token and press Enter
```

**Also set optional variables:**
```bash
# Set site name
wrangler secret put NUXT_SITE_NAME
# Enter: Avanta Design Links

# Set site description
wrangler secret put NUXT_SITE_DESCRIPTION
# Enter: Avanta Design URL Shortener with Analytics
```

---

## PHASE 4: CUSTOM DOMAIN CONFIGURATION (15 minutes)

### Step 4.1: Add Custom Domain in Cloudflare Dashboard

**Manual Steps:**
1. Go to: https://dash.cloudflare.com
2. Select the account with avanta.design
3. Navigate to: **Workers & Pages**
4. Click on: **avanta-shortener**
5. Go to: **Settings** tab
6. Click: **Triggers** (or **Domains & Routes**)
7. Click: **Add Custom Domain**
8. Enter domain options:

**Option A: Use main domain (recommended)**
- Domain: `avanta.design`
- This makes links like: `avanta.design/linkedin`

**Option B: Use subdomain**
- Domain: `go.avanta.design`
- This makes links like: `go.avanta.design/linkedin`

9. Click **Add Domain**
10. Wait 1-2 minutes for DNS propagation

---

### Step 4.2: Verify Domain Configuration

**Cursor Instructions:**
```bash
# Test the custom domain
curl -I https://avanta.design
# or
curl -I https://go.avanta.design
```

**Expected:** Should return HTTP 200 or redirect to Sink interface

**Browser Test:**
- Open: `https://avanta.design` (or your chosen domain)
- Should see Sink welcome page

---

## PHASE 5: LINK MIGRATION (45 minutes)

### Step 5.1: Prepare Migration Script
**Action:** Create automated import script for 87 T2M links

**Cursor Instructions:**
Create new file: `migrate-links.js`

**File: `migrate-links.js`**
```javascript
import { readFileSync } from 'fs';

// Load the migration JSON
const links = JSON.parse(readFileSync('./t2m_migration.json', 'utf8'));

console.log(`Preparing to migrate ${links.length} links...\n`);

// Generate wrangler commands
links.forEach((link, index) => {
  const slug = link.key;
  const dest = link.value.replace(/"/g, '\\"'); // Escape quotes
  const title = link.metadata.title || '';

  console.log(`# Link ${index + 1}/${links.length}: ${slug}`);
  console.log(`wrangler kv:key put --binding=KV "${slug}" "${dest}"`);
  console.log('');
});

console.log('\n✅ Migration commands generated!');
```

---

### Step 5.2: Generate Migration Commands
**Action:** Create executable migration script

**Cursor Instructions:**
```bash
# Make sure t2m_migration.json is in the Sink directory
# (Copy from where it was generated earlier)

# Run the migration script generator
node migrate-links.js > migration-commands.sh

# Make it executable (Mac/Linux)
chmod +x migration-commands.sh
```

---

### Step 5.3: Execute Link Migration
**Action:** Import all 87 links into Cloudflare KV

**Cursor Instructions:**

**Method A: Automated (Recommended)**
```bash
# Run the migration script
bash migration-commands.sh
```

**Method B: Bulk API Upload (Faster for many links)**
Create: `bulk-migrate.js`

```javascript
import { readFileSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const links = JSON.parse(readFileSync('./t2m_migration.json', 'utf8'));

async function migrateLinks() {
  console.log(`Starting migration of ${links.length} links...\n`);

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const slug = link.key;
    const dest = link.value;

    try {
      const cmd = `wrangler kv:key put --binding=KV "${slug}" "${dest}"`;
      await execAsync(cmd);
      console.log(`✅ ${i + 1}/${links.length}: ${slug}`);
    } catch (error) {
      console.error(`❌ Failed: ${slug}`, error.message);
    }

    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n🎉 Migration complete!');
}

migrateLinks();
```

**Run bulk migration:**
```bash
node bulk-migrate.js
```

---

### Step 5.4: Verify Migration
**Action:** Test that links are working

**Cursor Instructions:**
```bash
# Test a few critical links
curl -I https://avanta.design/linkedin
curl -I https://avanta.design/contacto
curl -I https://avanta.design/credenciales

# Should all return 301 redirects
```

**Manual browser tests:**
- `avanta.design/TecnologiasAventiaES` (most clicked - 303 clicks)
- `avanta.design/AventiaPresentaciones` (86 clicks)
- `avanta.design/credenciales` (66 clicks)

---

## PHASE 6: DASHBOARD ACCESS & MANAGEMENT (20 minutes)

### Step 6.1: Access Admin Dashboard
**Action:** Log into Sink management interface

**Steps:**
1. Go to: `https://avanta.design/dashboard` (or your domain + /dashboard)
2. Enter the `NUXT_SITE_TOKEN` you set earlier
3. Click **Login**

**Expected:** Dashboard with link management interface

---

### Step 6.2: Create First Link via Dashboard
**Action:** Test link creation workflow

**Steps:**
1. Click **Create New Link** (or **+ New**)
2. Enter:
   - **Slug:** `test-link`
   - **Destination:** `https://avantadesign.com`
   - **Title:** `Test Link`
3. Click **Create**
4. Test: `avanta.design/test-link`

---

### Step 6.3: Configure Analytics
**Action:** Verify analytics are tracking

**Steps:**
1. In dashboard, navigate to **Analytics** section
2. Should see data starting to populate
3. Click on any migrated link to see details
4. Verify metrics appear: clicks, referrers, devices, locations

**Note:** Analytics data starts accumulating from deployment forward (historical T2M click counts are preserved in metadata but won't show in live analytics)

---

### Step 6.4: Explore Dashboard Features
**Action:** Familiarize with management interface

**Features to test:**
- **Link List:** View all 87+ links
- **Search:** Find links by slug or destination
- **Edit:** Modify existing link destinations
- **Delete:** Remove unused links
- **Analytics:** View click statistics
- **Export:** Download link data

---

## PHASE 7: POST-DEPLOYMENT CONFIGURATION (15 minutes)

### Step 7.1: Update T2M Account Settings
**Action:** Add notice about migration

**Recommended approach:**
1. Keep T2M account active for 30 days
2. Update top 10 most-clicked links with 301 redirects to new system
3. Monitor for any stragglers
4. Cancel T2M subscription after transition period

---

### Step 7.2: Test Critical Links
**Action:** Verify all high-traffic links work

**Test these priority links (from T2M data):**
```bash
# Top 10 most clicked
curl -L https://avanta.design/TecnologiasAventiaES
curl -L https://avanta.design/AventiaPresentaciones
curl -L https://avanta.design/credenciales
curl -L https://avanta.design/AventiaPressKit
curl -L https://avanta.design/AventiaTecnologiesEN
curl -L https://avanta.design/AventiaNotion
curl -L https://avanta.design/contacto
curl -L https://avanta.design/RedesIndigo
curl -L https://avanta.design/AventiaDocs
curl -L https://avanta.design/AventiaGPT
```

---

### Step 7.3: Update Marketing Materials
**Action:** No changes needed! 

**Benefit:** All existing links use `avanta.design/slug` format, so:
- ✅ Social media profiles - no updates needed
- ✅ Business cards - still valid
- ✅ Email signatures - still work
- ✅ Marketing campaigns - no changes
- ✅ Client materials - all functional

---

### Step 7.4: Set Up Monitoring
**Action:** Enable alerts for downtime

**Cloudflare Dashboard:**
1. Go to **Workers & Pages** → **avanta-shortener**
2. Enable **Alerts** for:
   - Worker errors
   - High request rates
   - Performance issues

**Optional - External monitoring:**
```bash
# Use a free uptime monitor like:
# - UptimeRobot (https://uptimerobot.com)
# - Uptime.com
# - Better Uptime

# Monitor: https://avanta.design/contacto
# Check interval: 5 minutes
```

---

## PHASE 8: OPTIMIZATION & BEST PRACTICES (15 minutes)

### Step 8.1: Enable Caching for Performance
**Action:** Configure caching rules

**In `wrangler.toml`, add:**
```toml
[env.production]
routes = [
  { pattern = "avanta.design/*", zone_name = "avanta.design" }
]

[site]
bucket = ""

[build]
command = "npm run build"
```

---

### Step 8.2: Set Up Backup Strategy
**Action:** Create automated KV backup

**Create: `backup-links.js`**
```javascript
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

// Get all keys from KV
const keys = JSON.parse(
  execSync('wrangler kv:key list --binding=KV --prefix ""').toString()
);

console.log(`Backing up ${keys.length} links...`);

const backup = [];

for (const key of keys) {
  const value = execSync(`wrangler kv:key get --binding=KV "${key.name}"`).toString();
  backup.push({
    slug: key.name,
    destination: value,
    metadata: key.metadata
  });
}

const filename = `backup-${new Date().toISOString().split('T')[0]}.json`;
writeFileSync(filename, JSON.stringify(backup, null, 2));

console.log(`✅ Backup saved: ${filename}`);
```

**Run weekly:**
```bash
node backup-links.js
```

---

### Step 8.3: Document API Access
**Action:** Create API documentation for n8n integration

**Save as: `API_DOCUMENTATION.md`**
```markdown
# Avanta Shortener API

## Base URL
https://avanta.design

## Authentication
Bearer token: Use NUXT_SITE_TOKEN value

## Create Short Link
POST /api/links
Headers:
  Authorization: Bearer YOUR_TOKEN
Body:
{
  "slug": "example",
  "url": "https://destination.com",
  "title": "Optional Title"
}

## Get Link Stats
GET /api/links/:slug/stats
Headers:
  Authorization: Bearer YOUR_TOKEN

## List All Links
GET /api/links
Headers:
  Authorization: Bearer YOUR_TOKEN
```

---

### Step 8.4: Create n8n Integration Workflow
**Action:** Set up automated link creation from n8n

**n8n Workflow Template:**
1. Trigger: Webhook or scheduled
2. HTTP Request Node:
   - Method: POST
   - URL: `https://avanta.design/api/links`
   - Authentication: Header Auth
   - Header Name: `Authorization`
   - Header Value: `Bearer YOUR_TOKEN`
   - Body: JSON with slug and URL

---

## PHASE 9: DOCUMENTATION & HANDOFF (10 minutes)

### Step 9.1: Create Team Documentation
**Action:** Document for future team members

**Save as: `AVANTA_SHORTENER_GUIDE.md`**
```markdown
# Avanta Design URL Shortener Guide

## Quick Access
- Dashboard: https://avanta.design/dashboard
- Token: Stored in LastPass under "Avanta Shortener"

## Common Tasks

### Create a New Link
1. Go to dashboard
2. Click "New Link"
3. Enter slug and destination
4. Save

### View Analytics
1. Dashboard → Analytics
2. Click any link for details
3. Export data if needed

### Update a Link
1. Find link in dashboard
2. Click edit icon
3. Change destination
4. Save

## Emergency Contacts
- Cloudflare Account: [email]
- Emergency access: [backup admin]
```

---

### Step 9.2: Store Credentials Securely
**Action:** Save all access credentials

**Store in LastPass (or password manager):**
- Entry: "Avanta URL Shortener - Cloudflare"
- Username: Cloudflare account email
- Password: Cloudflare password
- Notes:
  - NUXT_SITE_TOKEN: [your token]
  - Dashboard URL: https://avanta.design/dashboard
  - Wrangler Auth: Stored in ~/.wrangler/config/
  - KV Namespace ID: [your KV ID]

---

### Step 9.3: Update Avanta Tech Stack Documentation
**Action:** Add Sink to official tech stack

**Update in Notion/documentation:**
```
## Link Management
- Platform: Sink (Self-hosted on Cloudflare)
- Domain: avanta.design
- Analytics: Cloudflare Workers Analytics
- Storage: Cloudflare KV
- Dashboard: https://avanta.design/dashboard
```

---

## VALIDATION CHECKLIST

### Pre-Launch Validation
- [ ] All 87 T2M links migrated successfully
- [ ] Custom domain (avanta.design) configured and working
- [ ] Dashboard accessible with secure token
- [ ] Analytics tracking active
- [ ] SSL/HTTPS working correctly
- [ ] Top 10 high-traffic links tested and working
- [ ] API access documented

### Post-Launch Validation (After 24 hours)
- [ ] No 404 errors reported
- [ ] Analytics showing click data
- [ ] Dashboard accessible
- [ ] Links redirect correctly
- [ ] Performance acceptable (< 300ms redirects)
- [ ] No security alerts from Cloudflare

### Week 1 Validation
- [ ] Compare click data with T2M final week
- [ ] Verify all links still functional
- [ ] Check for any broken redirects
- [ ] Review analytics patterns
- [ ] Gather team feedback

---

## TROUBLESHOOTING GUIDE

### Issue: Dashboard won't load
**Solution:**
```bash
# Check deployment status
wrangler deployments list

# Redeploy if needed
npm run build
npx wrangler deploy
```

### Issue: Links return 404
**Solution:**
```bash
# Verify KV contains the link
wrangler kv:key get --binding=KV "slug-name"

# Re-add if missing
wrangler kv:key put --binding=KV "slug" "destination-url"
```

### Issue: Analytics not showing
**Solution:**
- Analytics start from deployment forward
- Check after 24 hours of live traffic
- Verify Analytics Engine binding in wrangler.toml

### Issue: Custom domain not working
**Solution:**
```bash
# Check DNS propagation
dig avanta.design

# Verify in Cloudflare dashboard:
# Workers & Pages → avanta-shortener → Settings → Triggers
# Ensure custom domain is listed and active
```

### Issue: Token authentication fails
**Solution:**
```bash
# Reset the token
wrangler secret put NUXT_SITE_TOKEN
# Enter new token when prompted

# Clear browser cache and retry
```

---

## COST ANALYSIS

### Cloudflare Free Tier Limits
- **Workers Requests:** 100,000/day (more than sufficient)
- **KV Reads:** 100,000/day
- **KV Writes:** 1,000/day
- **KV Storage:** 1 GB

### Current T2M Usage
- 87 links stored (< 0.01 MB)
- ~948 total clicks = ~3-5 clicks/day average
- Well within free tier limits

### Estimated Savings
- T2M subscription: ~$5-20/month
- Cloudflare: $0/month (free tier)
- **Annual savings: $60-240**

---

## NEXT STEPS AFTER DEPLOYMENT

### Week 1
- Monitor analytics daily
- Compare performance with T2M final stats
- Gather team feedback
- Test all critical workflows

### Week 2-4
- Keep T2M active as backup
- Monitor for any issues
- Train team on new dashboard
- Create additional links as needed

### Month 2
- Cancel T2M subscription
- Archive T2M data
- Full transition complete
- Consider advanced features (QR codes, expiry dates, etc.)

---

## ADVANCED FEATURES TO EXPLORE

### Custom QR Code Generation
- Add QR code generation for each short link
- Integrate with marketing materials
- Track QR code specific analytics

### Link Expiration
- Set expiration dates for temporary campaigns
- Auto-archive expired links
- Notification before expiration

### A/B Testing
- Create multiple slugs for same destination
- Compare performance
- Optimize based on data

### API Integration with n8n
- Automate link creation from Notion
- Generate links from form submissions
- Sync with CRM campaigns

---

## SUCCESS METRICS

### Technical Metrics
- 0 downtime in first 30 days
- < 300ms average redirect time
- 100% link migration success rate
- 0 security incidents

### Business Metrics
- Cost savings: $60-240/year
- Full data ownership
- Unlimited link creation
- Enhanced analytics capabilities

### Team Metrics
- Team trained within 1 week
- Positive feedback on dashboard UX
- Increased link creation efficiency
- Self-serve link management

---

## SUPPORT RESOURCES

### Documentation
- Sink GitHub: https://github.com/ccbikai/Sink
- Cloudflare Workers: https://developers.cloudflare.com/workers/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/

### Community
- Cloudflare Discord: https://discord.gg/cloudflaredev
- Sink Issues: https://github.com/ccbikai/Sink/issues

### Avanta Internal
- Tech Stack Docs: [Notion link]
- LastPass: Credentials storage
- Team lead: [Contact info]

---

## CONCLUSION

This implementation provides Avanta Design with:
✅ Full control over link infrastructure
✅ Professional analytics and dashboard
✅ Zero ongoing costs (free tier)
✅ Enhanced security and privacy
✅ Scalability for future growth
✅ API access for automation

**Estimated Total Time:** 2-4 hours
**Difficulty Level:** Intermediate
**Maintenance:** < 30 minutes/month

---

**Document Version:** 1.0
**Last Updated:** October 10, 2025
**Created by:** Avanta Design_AI
**Status:** Ready for Implementation
