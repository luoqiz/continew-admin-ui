<template>
  <a-spin :loading="loading" :tip="isLogin() ? '绑定中...' : '登录中...'">
    <div></div>
  </a-spin>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { useRoute, useRouter } from 'vue-router'
import { resolveSocialTarget } from '@/apis/auth'
import { bindSocialAccount } from '@/apis/system'
import { useTabsStore, useTenantStore, useUserStore } from '@/stores'
import { TENANT_AUTH_CODE_STORAGE_KEY } from '@/stores/modules/tenant'
import { isLogin } from '@/utils/auth'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const tenantStore = useTenantStore()
const tabsStore = useTabsStore()
const source = route.query.source as string
const loading = ref(false)

// 第三方平台通常只支持配置平台回调地址，先把回调请求带回原租户入口。
const redirectToTenantHost = async () => {
  const state = route.query.state as string
  if (!state) return false
  try {
    const { data } = await resolveSocialTarget(state)
    const targetHost = data.targetHost?.toLowerCase()
    if (!targetHost || targetHost === window.location.hostname.toLowerCase()) return false
    const targetUrl = new URL(window.location.href)
    targetUrl.host = targetHost
    window.location.replace(targetUrl.toString())
    return true
  } catch {
    // 兼容未升级的旧 state，继续按当前入口尝试登录。
    return false
  }
}

// 三方账号登录
const handleSocialLogin = () => {
  if (loading.value) return
  loading.value = true
  const { redirect } = router.currentRoute.value.query
  const othersQuery = { ...router.currentRoute.value.query }
  delete othersQuery.redirect
  delete othersQuery.source
  delete othersQuery.code
  delete othersQuery.state
  // 回调页只在兼容入口恢复租户编码；域名入口依赖当前 Host 的后端解析结果。
  const tenantCode = tenantStore.tenantAuthMode === 'LEGACY'
    ? tenantStore.tenantCode || sessionStorage.getItem(TENANT_AUTH_CODE_STORAGE_KEY) || undefined
    : undefined
  userStore
    .socialLogin(source, othersQuery, tenantCode)
    .then(() => {
      sessionStorage.removeItem(TENANT_AUTH_CODE_STORAGE_KEY)
      tabsStore.reset()
      router.push({
        path: (redirect as string) || '/',
        query: {
          ...othersQuery,
        },
      })
      Message.success('欢迎使用')
    })
    .catch(() => {
      router.push({
        name: 'Login',
        query: {
          ...othersQuery,
        },
      })
    })
    .finally(() => {
      loading.value = false
    })
}

// 绑定三方账号
const handleBindSocial = () => {
  if (loading.value) return
  loading.value = true
  const othersQuery = { ...router.currentRoute.value.query }
  delete othersQuery.source
  delete othersQuery.code
  delete othersQuery.state
  bindSocialAccount(source, othersQuery)
    .then(() => {
      router.push({
        path: '/user/profile',
        query: {
          ...othersQuery,
        },
      })
      Message.success('绑定成功')
    })
    .catch(() => {
      router.push({
        path: '/user/profile',
        query: {
          ...othersQuery,
        },
      })
    })
    .finally(() => {
      loading.value = false
    })
}

const handleCallback = async () => {
  // 先回到发起授权的租户域名，再提交 code/state，避免登录结果落到错误租户。
  if (await redirectToTenantHost()) return
  if (isLogin()) {
    handleBindSocial()
  } else {
    handleSocialLogin()
  }
}

handleCallback()
</script>

<style scoped lang="less">
:deep(.arco-spin-mask) {
  background-color: transparent;
}

div {
  width: 150px;
  height: 150px;
  position: absolute;
  left: 50%;
  top: 45%;
  margin-left: -50px;
  margin-top: -50px;
}
</style>
