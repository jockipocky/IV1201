import { createApp, ref } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import { router } from './router'

//our language switching system
import { getDictionary, type Language } from './i18n'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', // default icon set
    aliases,
    sets: {
      mdi,
    },
  },
})

const app = createApp(App)

//set up the default language (en) so its available everywhere as a global object
const currentLanguage = ref<Language>('en')
const t = ref(getDictionary(currentLanguage.value))

//function to switch language
const setLanguage = (lang: Language) => {
  currentLanguage.value = lang
  t.value = getDictionary(lang)
}

//here we provide globally available references to both the current chosen language and its dict (t) as well as
//the function to set the language.
//to use this we import vue's inject like so in script section:
// import { inject } from 'vue'
// const t = inject<any>('t')
// then in template section we call {{ t.someKey }}
app.provide('t', t)
app.provide('setLanguage', setLanguage)
app.provide('currentLanguage', currentLanguage)

//use libraries
app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
