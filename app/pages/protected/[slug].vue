<script setup>
import { Lock } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

definePageMeta({
  layout: false,
})

const route = useRoute()
const slug = computed(() => route.params.slug)

const password = ref('')
const isLoading = ref(false)

async function handleSubmit() {
  if (!password.value) {
    toast.error('Please enter a password')
    return
  }

  isLoading.value = true
  try {
    const { url } = await useAPI('/api/verify-password', {
      method: 'POST',
      body: {
        slug: slug.value,
        password: password.value,
      },
    })

    if (url) {
      // Redirect to the actual URL
      window.location.href = url
    }
  }
  catch (error) {
    console.error('Password verification failed:', error)
    toast.error('Incorrect password. Please try again.')
    password.value = ''
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background">
    <Card class="w-full max-w-md mx-4">
      <CardHeader class="text-center">
        <div class="flex justify-center mb-4">
          <div class="p-3 bg-muted rounded-full">
            <Lock class="w-8 h-8" />
          </div>
        </div>
        <CardTitle class="text-2xl">
          Password Protected Link
        </CardTitle>
        <CardDescription>
          This link requires a password to access
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          class="space-y-4"
          @submit.prevent="handleSubmit"
        >
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter password"
              :disabled="isLoading"
              autofocus
            />
          </div>
          <Button
            type="submit"
            class="w-full"
            :disabled="isLoading || !password"
          >
            <span v-if="isLoading">Verifying...</span>
            <span v-else>Access Link</span>
          </Button>
        </form>
      </CardContent>
      <CardFooter class="text-center">
        <p class="text-sm text-muted-foreground w-full">
          Don't have the password? Contact the link owner.
        </p>
      </CardFooter>
    </Card>
  </div>
</template>
