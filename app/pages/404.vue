<script setup>
// Custom 404 page with cache-busting functionality
definePageMeta({
  layout: false,
})

const route = useRoute()
const router = useRouter()

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
  <div class="flex min-h-screen items-center justify-center bg-background">
    <Card class="w-full max-w-md mx-4">
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
  </div>
</template>
