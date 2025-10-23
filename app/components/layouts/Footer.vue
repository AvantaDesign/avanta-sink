<script setup>
import { GmailIcon } from 'vue3-simple-icons'

const { title, email } = useAppConfig()
</script>

<template>
  <section class="md:pt-6 border-t mt-12">
    <div class="container flex flex-col items-center py-8 mx-auto sm:flex-row">
      <a
        href="/"
        class="text-xl font-bold leading-none select-none bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent logo flex items-center gap-2"
        :title="title"
      >
        <img
          src="/newicons/Imagotipo Avanta White_NO BORDER.png"
          alt="Avanta Design"
          class="h-10 w-auto"
        >
      </a>
      <a
        class="mt-4 text-sm text-muted-foreground sm:ml-4 sm:pl-4 sm:border-l sm:mt-0 hover:text-foreground transition-colors"
        href="https://avantadesign.com"
        target="_blank"
        title="Avanta Design"
        rel="noopener"
      >
        &copy; {{ new Date().getFullYear() }} Avanta Design
      </a>
      <span
        class="inline-flex justify-center mt-4 space-x-4 sm:ml-auto sm:mt-0 sm:justify-start"
      >
        <a
          v-if="email"
          :href="`mailto:${email}`"
          title="Email"
          class="text-muted-foreground hover:text-primary transition-colors"
        >
          <span class="sr-only">Email</span>
          <GmailIcon
            class="w-5 h-5"
          />
        </a>
      </span>
    </div>
  </section>
</template>
