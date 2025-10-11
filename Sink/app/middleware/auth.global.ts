export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server)
    return

  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    if (!window.localStorage.getItem('SinkSiteToken'))
      return navigateTo('/admin/login')
  }

  if (to.path === '/admin/login') {
    try {
      await useAPI('/api/verify')
      return navigateTo('/admin')
    }
    catch (e) {
      console.warn(e)
    }
  }
})
