<script setup lang="ts">
import { VForm } from "vuetify/components/VForm";
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import authV2LoginIllustrationBorderedDark from "@images/pages/auth-v2-login-illustration-bordered-dark.png";
import authV2LoginIllustrationBorderedLight from "@images/pages/auth-v2-login-illustration-bordered-light.png";
import authV2LoginIllustrationDark from "@images/pages/auth-v2-login-illustration-dark.png";
import authV2LoginIllustrationLight from "@images/pages/auth-v2-login-illustration-light.png";
import authV2MaskDark from "@images/pages/misc-mask-dark.png";
import authV2MaskLight from "@images/pages/misc-mask-light.png";
import axios from "axios";
import router from "@/router";
import { emailValidator, requiredValidator } from "../@core/utils/validators";
import { ref } from "vue";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const refVForm = ref<VForm>();
const store = useAuthStore();
const { username, handleLogout } = store;
const loginData = ref({
  email: username,
  oldPassword: "",
  newPassword: "",
});

const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true
);
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);

const isoldPasswordVisible = ref(false);
const isnewPasswordVisible = ref(false);

const handlePasswordReset = async () => {
  refVForm.value?.validate().then(async (res) => {
    if (res.valid) {
      const accessToken = localStorage.getItem("access_token");
      try {
        const response = await axios.post("resetPassword", loginData.value, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response) {
          handleLogout();
          router.push("/login");
          loginData.value.email = "";
          loginData.value.oldPassword = "";
          loginData.value.newPassword = "";
          toast(`${response.data.message}`, {
            type: "success",
          });
        }
      } catch (error: any) {
        toast(`InValid Credentials : ${error.message}`, {
          type: "error",
        });
      } finally {
        loginData.value = {
          email: username,
          oldPassword: "",
          newPassword: "",
        };
      }
    }
  });
};
</script>

<template>
  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol lg="8" class="d-none d-lg-flex">
      <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            :src="authThemeImg"
            max-width="505"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg :src="authThemeMask" class="auth-footer-mask" />
      </div>
    </VCol>

    <VCol
      cols="12"
      lg="4"
      class="auth-card-v2 d-flex align-center justify-center"
    >
      <VCard :max-width="500" flat class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <h5 class="text-h5 mb-1">Welcome Back! 👋🏻</h5>

          <p class="mb-0">And Reset Your Password...</p>
        </VCardText>

        <VCardText>
          <VForm ref="refVForm" @submit.prevent="handlePasswordReset">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="loginData.email"
                  :rules="[emailValidator, requiredValidator]"
                  autofocus
                  label="Email"
                  type="email"
                />
              </VCol>

              <!-- old password -->
              <VCol cols="12">
                <AppTextField
                  v-model="loginData.oldPassword"
                  label="Old Password"
                  :type="isoldPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isoldPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  :rules="[requiredValidator]"
                  @click:append-inner="
                    isoldPasswordVisible = !isoldPasswordVisible
                  "
                />
              </VCol>

              <!-- new password -->
              <VCol cols="12">
                <AppTextField
                  v-model="loginData.newPassword"
                  label="New Password"
                  :type="isnewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isnewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  :rules="[requiredValidator]"
                  @click:append-inner="
                    isnewPasswordVisible = !isnewPasswordVisible
                  "
                />
              </VCol>
              <VCol cols="12">
                <VBtn block type="submit" class="mt-4"> Reset Password </VBtn>
              </VCol>
              <VCol cols="12">
                <RouterLink to="/">
                  <VBtn block type="submit" class="mt-1"> Cancel </VBtn>
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
