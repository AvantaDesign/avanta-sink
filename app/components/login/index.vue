<script setup>
import { AlertCircle } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { z } from 'zod'

const { t } = useI18n()

const LoginSchema = z.object({
  username: z.string().optional().describe('Username'),
  token: z.string().describe('Password'),
})
const loginFieldConfig = {
  username: {
    inputProps: {
      type: 'text',
      placeholder: 'admin',
      autocomplete: 'username',
      name: 'username',
    },
  },
  token: {
    label: 'Password',
    inputProps: {
      type: 'password',
      placeholder: '••••••••',
      autocomplete: 'current-password',
      name: 'password',
    },
  },
}

const { previewMode } = useRuntimeConfig().public

async function onSubmit(form) {
  try {
    localStorage.setItem('SinkSiteToken', form.token)
    await useAPI('/api/verify')
    navigateTo('/admin')
  }
  catch (e) {
    console.error(e)
    toast.error(t('login.failed'), {
      description: e.message,
    })
  }
}
</script>

<template>
  <Card class="w-full max-w-sm shadow-lg">
    <CardHeader class="space-y-1">
      <CardTitle class="text-2xl font-bold tracking-tight">
        Avanta Link Manager
      </CardTitle>
      <CardDescription class="text-base">
        Enter your credentials to access the dashboard
      </CardDescription>
    </CardHeader>
    <CardContent class="grid gap-4">
      <AutoForm
        class="space-y-4"
        :schema="LoginSchema"
        :field-config="loginFieldConfig"
        @submit="onSubmit"
      >
        <Alert v-if="previewMode" variant="default" class="border-primary/50 bg-primary/5">
          <AlertCircle class="w-4 h-4" />
          <AlertTitle>{{ $t('login.tips') }}</AlertTitle>
          <AlertDescription>
            {{ $t('login.preview_token') }} <code class="font-mono text-primary font-semibold">SinkCool</code>
          </AlertDescription>
        </Alert>
        <Button class="w-full bg-primary hover:bg-primary/90" size="lg">
          Sign In
        </Button>
      </AutoForm>
    </CardContent>
    <CardFooter class="flex flex-col space-y-2">
      <p class="text-xs text-center text-muted-foreground">
        Internal tool for Avanta Design team
      </p>
    </CardFooter>
  </Card>
</template>
