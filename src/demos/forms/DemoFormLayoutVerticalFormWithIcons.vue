<script lang="ts" setup>
import { ref } from 'vue';

const firstName = ref('')
const email = ref('')
const mobile = ref<number>()
const password = ref<string>()
const checkbox = ref(false)
const dialog = ref(true)
</script>

<template>
  <div class="text-center pa-4">
    <VDialog
      v-model="dialog"
      transition="dialog-left-transition"
      direction="right"
      width="25%"
    >
    <VForm @submit.prevent="{}">
      <VRow>
        <VCol cols="12">
          <AppTextField
            v-model="firstName"
            prepend-inner-icon="tabler-user"
            label="First Name"
            placeholder="First Name"
          />
        </VCol>
  
        <VCol cols="12">
          <AppTextField
            v-model="email"
            prepend-inner-icon="tabler-mail"
            label="Email"
            type="email"
            placeholder="Email"
          />
        </VCol>
  
        <VCol cols="12">
          <AppTextField
            v-model="mobile"
            prepend-inner-icon="tabler-device-mobile"
            label="Mobile"
            type="number"
            placeholder="Number"
          />
        </VCol>
  
        <VCol cols="12">
          <AppTextField
            v-model="password"
            prepend-inner-icon="tabler-lock"
            label="Password"
            type="password"
            placeholder="Password"
          />
        </VCol>
  
        <VCol cols="12">
          <VCheckbox
            v-model="checkbox"
            label="Remember me"
          />
        </VCol>
  
        <VCol cols="12">
          <VBtn
            type="submit"
            class="me-2"
          >
            Submit
          </VBtn>
  
          <VBtn
            color="secondary"
            type="reset"
            variant="tonal"
          >
            Reset
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
    </VDialog>
  </div>
</template>
