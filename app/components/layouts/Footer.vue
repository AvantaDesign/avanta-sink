<script setup>
import { GitHubIcon, GmailIcon } from 'vue3-simple-icons'

const { title, email, github } = useAppConfig()
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
          class="w-8 h-8"
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

        <a
          v-if="github"
          :href="github"
          target="_blank"
          title="GitHub"
          class="text-muted-foreground hover:text-primary transition-colors"
          rel="noopener"
        >
          <span class="sr-only">GitHub</span>
          <GitHubIcon
            class="w-5 h-5"
          />
        </a>

        <a
          href="https://avantadesign.com"
          target="_blank"
          title="Avanta Design Website"
          class="text-muted-foreground hover:text-primary transition-colors"
          rel="noopener"
        >
          <span class="sr-only">Avanta Design</span>
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
          </svg>
        </a>
      </span>
    </div>
  </section>
</template>
