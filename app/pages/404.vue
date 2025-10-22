<script setup>
// Custom 404 page with cache-busting functionality
definePageMeta({
  layout: false,
})

// Ensure no global components are loaded
const route = useRoute()
const router = useRouter()

// Disable any global middleware or components
useHead({
  title: 'Link Not Found - Avanta Design',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ],
  bodyAttrs: {
    class: 'error-page'
  }
})

// Override any global components
onMounted(() => {
  // Remove any admin/dashboard elements that might be globally loaded
  const adminElements = document.querySelectorAll('[href*="admin"], [href*="dashboard"], .admin-nav, .dashboard-nav')
  adminElements.forEach(el => el.remove())
  
  // Ensure body has no admin classes
  document.body.classList.remove('admin', 'dashboard')
})

// Function to clear cache and retry
function clearCacheAndRetry() {
  const url = new URL(window.location.href)
  const params = new URLSearchParams(url.search)
  params.set('cache_bust', Date.now().toString())
  url.search = params.toString()
  window.location.replace(url.toString())
}

// Function to go back
function goBack() {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    router.push('/')
  }
}

// Auto-retry with cache-busting if no cache-bust parameter is present
onMounted(() => {
  const url = new URL(window.location.href)
  const params = new URLSearchParams(url.search)
  
  if (!params.has('cache_bust') && !params.has('v') && !params.has('timestamp')) {
    // Wait a moment then auto-retry with cache-busting
    setTimeout(() => {
      clearCacheAndRetry()
    }, 2000)
  }
})
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col" style="position: relative; z-index: 9999;">
    <!-- Ensure no global components are visible -->
    <style>
      /* Hide any potential global admin components */
      .admin-nav, .dashboard-nav, .admin-buttons, 
      [class*="admin"], [class*="dashboard"], 
      .nav-admin, .nav-dashboard,
      a[href*="admin"], a[href*="dashboard"],
      .switch-language, .switch-theme,
      [class*="switch"] {
        display: none !important;
        visibility: hidden !important;
      }
      
      /* Ensure 404 page takes full control */
      body.error-page {
        overflow-x: hidden;
        margin: 0;
        padding: 0;
      }
      
      /* Hide any navigation elements */
      nav, header nav, .navigation {
        display: none !important;
      }
      
      /* Ensure our header is the only one visible */
      .error-page header {
        display: flex !important;
      }
    </style>
    <!-- Header with only logo -->
    <header class="flex justify-center items-center py-8">
      <div class="flex items-center space-x-3">
        <img 
          src="/newicons/Isotipo Avanta PP_2.jpg" 
          alt="Avanta Design" 
          class="h-12 w-12 rounded-lg"
        />
        <div>
          <h1 class="text-xl font-bold text-foreground">Avanta Design</h1>
          <p class="text-sm text-muted-foreground">Link Shortener</p>
        </div>
      </div>
    </header>

    <!-- Main content - centered -->
    <main class="flex-1 flex items-center justify-center px-4">
      <Card class="w-full max-w-md">
        <CardHeader class="text-center">
          <div class="flex justify-center mb-4">
            <div class="p-3 bg-muted rounded-full">
              <AlertCircle class="w-8 h-8 text-destructive" />
            </div>
          </div>
          <CardTitle class="text-2xl">
            Link Not Found
          </CardTitle>
          <CardDescription>
            The link you're looking for doesn't exist or may have been cached incorrectly.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="text-center space-y-2">
            <p class="text-sm text-muted-foreground">
              If you recently accessed this link, it might be cached incorrectly.
            </p>
            <p class="text-xs text-muted-foreground">
              Auto-retrying with cache-busting...
            </p>
          </div>
          
          <div class="flex flex-col space-y-2">
            <Button @click="clearCacheAndRetry" class="w-full">
              <RefreshCw class="w-4 h-4 mr-2" />
              Clear Cache & Retry
            </Button>
            
            <Button variant="outline" @click="goBack" class="w-full">
              <ArrowLeft class="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
        <CardFooter class="text-center">
          <p class="text-xs text-muted-foreground w-full">
            If the problem persists, the link may have been deleted or expired.
          </p>
        </CardFooter>
      </Card>
    </main>

    <!-- Footer with minimal branding -->
    <footer class="py-8 text-center">
      <p class="text-xs text-muted-foreground">
        © 2024 Avanta Design. All rights reserved.
      </p>
    </footer>
  </div>
</template>
