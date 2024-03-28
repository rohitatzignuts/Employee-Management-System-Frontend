<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { VForm } from 'vuetify/components/VForm'
import axios from 'axios';
import { emailValidator, requiredValidator } from '../../@core/utils/validators'
import { ref, nextTick } from 'vue';

interface Emit {
  (e: 'update:isDrawerOpen', value: boolean): void
  (e: 'companyData', value: Object): void
}

interface Props {
  isDrawerOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const isFormValid = ref(false)
const refForm = ref<VForm>()

const companyData = ref({
  'name': '',
  'logo': '',
  'website': '',
  'cmp_email': '',
  'location': '',
  'cmp_admin_first_name': '',
  'cmp_admin_last_name': '',
  'cmp_admin_email': '',
  'cmp_admin_password': '',
})

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)

  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}

const onSubmit = async () => {
  const access_token = localStorage.getItem("access_token")
  if (access_token) {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/company/create', companyData.value, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
      if (response.data.status == "200") {
        console.log(response.data.message);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }finally{
      companyData.value = {}
    }
  }
};


const handleDrawerModelValueUpdate = (val: boolean) => {
  emit('update:isDrawerOpen', val)
}
</script>

<template>
  <VNavigationDrawer temporary :width="400" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">
    <!-- 👉 Title -->
    <AppDrawerHeaderSection title="Add Company" @cancel="closeNavigationDrawer" />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
            <VRow>
              <!-- 👉 Company Name -->
              <VCol cols="12">
                <AppTextField v-model="companyData.name" :rules="[requiredValidator]" label="Company Name" />
              </VCol>

              <!-- 👉 Company Email -->
              <VCol cols="12">
                <AppTextField v-model="companyData.cmp_email" :rules="[requiredValidator, emailValidator]"
                  label="Company Email" />
              </VCol>

              <!-- 👉 company website -->
              <VCol cols="12">
                <AppTextField v-model="companyData.website" :rules="[requiredValidator]" label="Company Website" />
              </VCol>

              <!-- 👉 company website -->
              <VCol cols="12">
                <AppTextField v-model="companyData.location" :rules="[requiredValidator]" label="Company Address" />
              </VCol>

              <!-- 👉 Logo -->
              <VCol cols="12">
                <AppTextField v-model="companyData.logo" type="file" 
                  label="Company Logo" />
              </VCol>

              <VDivider class="my-4" />

              <!-- 👉 Company Admin First Name -->
              <VCol cols="12">
                <AppTextField v-model="companyData.cmp_admin_first_name" :rules="[requiredValidator]"
                  label="Company Admin First Name" />
              </VCol>

              <!-- 👉 Company Admin last Name -->
              <VCol cols="12">
                <AppTextField v-model="companyData.cmp_admin_last_name" :rules="[requiredValidator]"
                  label="Company Admin Last Name" />
              </VCol>

              <!-- 👉 Company Admin Email -->
              <VCol cols="12">
                <AppTextField v-model="companyData.cmp_admin_email" type="email"
                  :rules="[requiredValidator, emailValidator]" label="Company Admin Email" />
              </VCol>

              <!-- 👉 Company Admin password -->
              <VCol cols="12">
                <AppTextField v-model="companyData.cmp_admin_password" type="password" :rules="[requiredValidator]"
                  label="Company Admin password" />
              </VCol>

              <!-- 👉 Status
              <VCol cols="12">
                <AppSelect
                  v-model="status"
                  label="Select Status"
                  :rules="[requiredValidator]"
                  :items="[{ title: 'Active', value: 'active' }, { title: 'Inactive', value: 'inactive' }, { title: 'Pending', value: 'pending' }]"
                />
              </VCol> -->

              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn type="submit" class="me-3">
                  Submit
                </VBtn>
                <VBtn type="reset" variant="tonal" color="secondary" @click="closeNavigationDrawer">
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
