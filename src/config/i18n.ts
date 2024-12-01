import { createI18n } from 'vue-i18n'
import { getLanguageByType } from '@/apis'

let i18n

const setI18n = (lang) => {
  i18n = createI18n({
    locale: 'zh',
    legacy: false,
    globalInjection: true,
    messages: {
      zh: lang.data,
    },
  })
  return i18n
}

const loadI18n = async (app: any) => {
  const lang = await getLanguageByType('zh')
  setI18n(lang)
  app.use(i18n)
}

export { loadI18n, i18n }
