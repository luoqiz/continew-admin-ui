import { defineStore } from 'pinia'
import { getLanguageByType, getLanguageType } from '@/apis'
import { i18n } from '@/config/i18n'

const storeSetup = () => {
  // 语言类型列表
  const languageTypeList = ref<any>([])
  // 当前语言类型
  const currentLanguage = ref()
  // 获取语言类型
  const loadLanguageType = async () => {
    if (currentLanguage.value) {
      const lang = await getLanguageByType(currentLanguage.value.value)
      i18n.global.setLocaleMessage(currentLanguage.value.value, lang.data)
      i18n.global.locale.value = currentLanguage.value.value
    }
    if (languageTypeList.value.length > 0) {
      return languageTypeList
    }
    const langs = await getLanguageType()
    languageTypeList.value = langs.data
    return languageTypeList
  }

  const changeTranslation = async (item) => {
    const lang = await getLanguageByType(item.value)
    i18n.global.setLocaleMessage(item.value, lang.data)
    currentLanguage.value = item
    i18n.global.locale.value = item.value
  }

  const initLanguageConfig = async () => {
    await loadLanguageType()
  }

  return {
    loadLanguageType,
    languageTypeList,
    currentLanguage,
    initLanguageConfig,
    changeTranslation
  }
}

export const useLanguageStore = defineStore('language', storeSetup, { persist: true })
