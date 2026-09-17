export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: false },
  app: {
    head: {
      title: 'Notes — Nuxt 3',
      meta: [
        { name: 'description', content: 'CRUD заметок с поиском и тегами на Nuxt 3' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  imports: {
    dirs: ['composables', 'types'],
  },
  typescript: {
    strict: true,
  },
})
