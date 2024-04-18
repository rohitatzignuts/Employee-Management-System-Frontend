<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import axios from 'axios'
import router from '@/router'
import { emailValidator, requiredValidator } from '../@core/utils/validators'
import CryptoJS from 'crypto-js'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const refVForm = ref<VForm>()
const loginData = ref({
  email: '',
  password: '',
})

const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

const isPasswordVisible = ref(false)

const handleLogin = async () => {
  refVForm.value?.validate().then(async (res) => {
    if (res.valid) {
      try {
        const response = await axios.post("login", loginData.value)
        if (response) {
          localStorage.setItem("username", loginData.value.email)
          localStorage.setItem("access_token", response.data.access_token)
          localStorage.setItem(
            "userRole",
            CryptoJS.AES.encrypt(response.data.role, "role").toString()
          )
          localStorage.setItem(
            "company",
            CryptoJS.AES.encrypt(
              JSON.stringify({
                id: response.data.company_id,
                name: response.data.company_name,
              }),
              "company"
            ).toString()
          )
          toast(`Logged in !!`, {
            type: "success",
          })
          router.push("/")
        }
      } catch (e: any) {
        toast(`Invalid Credentials : ${e.message}`, {
          type: "error",
        })
      }
    }
  })
}
</script>

<template>
  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol lg="8" class="d-none d-lg-flex">
      <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg max-width="505" :src="authThemeImg" class="auth-illustration mt-16 mb-2" />
        </div>

        <VImg :src="authThemeMask" class="auth-footer-mask" />
      </div>
    </VCol>

    <VCol cols="12" lg="4" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat :width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText class="pa-0">
          <h5 class="text-h5 mb-1">
            Welcome ! 👋🏻
          </h5>

          <p>
            Please sign-in to your account...
          </p>
        </VCardText>
        <VDivider class="py-2" />
        <VCardText class="pa-0">
          <VForm ref="refVForm" @submit.prevent="handleLogin">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField v-model="loginData.email" label="Email" type="email" autofocus
                  :rules="[emailValidator, requiredValidator]" />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField v-model="loginData.password" label="Password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" :rules="[requiredValidator]" />
              </VCol>

              <VCol cols="12" class="text-center">
                <VBtn block type="submit" class="mt-4">
                  Login
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss"
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
