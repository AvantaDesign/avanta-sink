<script setup>
import { Link, BarChart3 } from 'lucide-vue-next'

const { title, description } = useAppConfig()
</script>

<template>
  <main
    class="grid pt-16 pb-16 lg:grid-cols-2 place-items-center md:py-20 gap-8"
  >
    <div class="space-y-6">
      <div class="space-y-4">
        <h1
          class="text-4xl font-bold lg:text-5xl xl:text-6xl lg:tracking-tight xl:tracking-tighter bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"
        >
          {{ title }}
        </h1>
        <p class="max-w-xl text-lg text-muted-foreground leading-relaxed">
          {{ description }}
        </p>
      </div>
      <div class="flex flex-col gap-3 sm:flex-row">
        <HomeLink
          href="/admin"
          title="Dashboard"
          class="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          rel="noopener"
        >
          <BarChart3 class="w-5 h-5" />
          Open Dashboard
        </HomeLink>
        <HomeLink
          size="lg"
          type="outline"
          href="/admin/links"
          title="Manage Links"
          class="flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary/10"
        >
          <Link class="w-5 h-5" />
          Manage Links
        </HomeLink>
      </div>
      <p class="text-sm text-muted-foreground">
        Internal tool for the Avanta Design team
      </p>
    </div>
    <div class="hidden lg:flex items-center justify-center">
      <div class="relative w-full max-w-md aspect-square">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 rounded-3xl blur-3xl" />
        <div class="relative h-full w-full flex items-center justify-center">
          <div class="space-y-4 w-full">
            <div class="bg-card border rounded-lg p-6 shadow-lg backdrop-blur-sm">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Link class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 class="font-semibold">Quick Links</h3>
                  <p class="text-sm text-muted-foreground">84 active links</p>
                </div>
              </div>
              <div class="space-y-2">
                <div class="h-2 bg-primary/20 rounded-full overflow-hidden">
                  <div class="h-full bg-primary rounded-full" style="width: 75%" />
                </div>
                <p class="text-xs text-muted-foreground">Link usage this month</p>
              </div>
            </div>
            <div class="bg-card border rounded-lg p-6 shadow-lg backdrop-blur-sm">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <BarChart3 class="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 class="font-semibold">Analytics</h3>
                  <p class="text-sm text-muted-foreground">Real-time tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
