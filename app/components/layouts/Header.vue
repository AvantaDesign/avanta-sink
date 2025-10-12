<script setup>
import { Ellipsis, X, Link } from 'lucide-vue-next'

const showMenu = ref(false)
const { title } = useAppConfig()
</script>

<template>
  <section class="pb-6">
    <nav class="container relative z-50 h-20 select-none">
      <div
        class="container relative flex flex-wrap items-center justify-between h-20 px-0 mx-auto overflow-hidden font-medium border-b md:overflow-visible lg:justify-center"
      >
        <div class="flex items-center justify-start w-1/4 h-full pr-4">
          <a
            href="/admin/links"
            :title="title"
            class="flex items-center py-4 space-x-2 text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent md:py-0 hover:opacity-80 transition-opacity"
          >
            <img
              src="/newicons/Imagotipo Avanta White_NO BORDER.png"
              alt="Avanta Design"
              class="w-10 h-10"
            />
            <span class="mx-2">Avanta</span>
          </a>
        </div>

        <div
          class="top-0 left-0 items-start w-full h-full p-4 text-sm bg-gray-900 bg-opacity-50 md:items-center md:w-3/4 md:absolute lg:text-base md:bg-transparent md:p-0 md:relative md:flex"
          :class="{ 'flex fixed': showMenu, 'hidden': !showMenu }"
          @touchmove.prevent
        >
          <div
            class="flex-col w-full h-auto overflow-hidden rounded-lg bg-background md:overflow-visible md:rounded-none md:relative md:flex md:flex-row"
          >
            <a
              href="/admin/links"
              :title="title"
              class="inline-flex items-center w-auto h-16 px-4 text-xl font-bold leading-none md:hidden"
            >
              <span
                class="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary p-2"
              >
                <Link class="w-6 h-6 text-white" />
              </span>
              <span class="mx-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Avanta</span>
            </a>
            <div class="w-auto mx-4" />
            <div
              class="flex flex-col items-start justify-end w-full pt-4 md:items-center md:flex-row md:py-0"
            >
              <a
                class="w-full px-6 py-2 mr-0 text-foreground hover:text-primary transition-colors cursor-pointer md:px-3 md:mr-2 lg:mr-3 md:w-auto font-medium"
                href="/admin"
                :title="`${title} Dashboard`"
              >{{ $t('dashboard.title') }}</a>
              <a
                href="https://avantadesign.com"
                target="_blank"
                title="Avanta Design Website"
                class="w-full px-6 py-2 mr-0 text-foreground hover:text-primary transition-colors cursor-pointer md:px-3 md:mr-2 lg:mr-3 md:w-auto font-medium"
                rel="noopener"
              >Main Site</a>

              <SwitchLanguage />

              <SwitchTheme />
            </div>
          </div>
        </div>

        <div
          class="absolute right-0 flex flex-col items-center justify-center w-10 h-10 rounded-full cursor-pointer md:hidden hover:bg-muted"
          :class="{ 'right-2': showMenu }"
          @click="showMenu = !showMenu"
        >
          <Ellipsis
            v-show="!showMenu"
            class="w-6 h-6"
          />
          <X
            v-show="showMenu"
            class="w-6 h-6"
          />
        </div>
      </div>
    </nav>
  </section>
</template>
