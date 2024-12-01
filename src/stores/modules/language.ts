import { defineStore } from 'pinia'
import { getLanguageByType, getLanguageType } from '@/apis'
import { i18n } from '@/config/i18n'

const storeSetup = () => {
  // 语言类型列表
  const languageTypeList = ref<any>([])
  // 当前语言类型
  const currentLanguage = ref()
  // 更换当前语言包
  const changeTranslation = async (item) => {
    const lang = await getLanguageByType(item.value)
    i18n.global.setLocaleMessage(item.value, lang.data)
    currentLanguage.value = item
    i18n.global.locale.value = item.value
  }
  // 获取语言类型
  const loadLanguageType = async () => {
    if (languageTypeList.value.length > 0) {
      if (!currentLanguage.value) {
        changeTranslation(languageTypeList.value[0])
      }
      return languageTypeList
    }
    // 当前没有语言类型，从后台更新
    const langs = await getLanguageType()
    languageTypeList.value = langs.data
    changeTranslation(currentLanguage.value ?? languageTypeList.value[0])
    return languageTypeList
  }

  const initLanguageConfig = async () => {
    await loadLanguageType()
  }

  return {
    loadLanguageType,
    languageTypeList,
    currentLanguage,
    initLanguageConfig,
    changeTranslation,
  }
}

export const useLanguageStore = defineStore('language', storeSetup, { persist: true })
