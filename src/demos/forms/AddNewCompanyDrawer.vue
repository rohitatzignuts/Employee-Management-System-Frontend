<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { VForm } from 'vuetify/components/VForm'
import axios from 'axios';
import { emailValidator, requiredValidator } from '../../@core/utils/validators'
import { ref, nextTick, watchEffect } from 'vue';

interface Emit {
  (e: 'closeDialog', value: Boolean): void
}

interface Props {
  isDrawerOpen: boolean
  companyId?: string | number
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const logoFile = ref('')
const isEditing = ref<Boolean>(false)
const isFormValid = ref(false)
const refForm = ref<VForm>()
const getCompanyId = ref<string | number | null>(props.companyId ?? null)

const companyData = ref({
  'name': '',
  'logo': undefined,
  'website': '',
  'cmp_email': '',
  'location': '',
  'is_active': false
})

const cmpAdminData = ref({
  'cmp_admin_first_name': '',
  'cmp_admin_last_name': '',
  'cmp_admin_email': '',
  'cmp_admin_password': '',
  'cmp_admin_joining_date': '',
})

const onLogoChange = (e: any) => {
  logoFile.value = e.target.files[0];
}

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('closeDialog', false)
  isEditing.value = false

  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}

// 👉 get the company data on the basis of ID
const getCompanyData = async (comId: string | number) => {
  try {
    const access_token = localStorage.getItem("access_token");
    const response = await axios.get(`http://127.0.0.1:8000/api/company/${comId}}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'content-type': 'multipart/form-data'
      }
    })
    companyData.value = response.data.company;
    cmpAdminData.value.cmp_admin_first_name = response.data.employee.user.first_name
    cmpAdminData.value.cmp_admin_last_name = response.data.employee.user.last_name
    cmpAdminData.value.cmp_admin_joining_date = response.data.employee.joining_date
    cmpAdminData.value.cmp_admin_email = response.data.employee.user.email
    getCompanyId.value = null
    if (response.data.company.is_active) {
      companyData.value.is_active = true
    } else {
      companyData.value.is_active = false
    }
  } catch (error) {
    console.error("Error submitting data:", error);
  }
}

// 👉 edit existig company and create a new company
const onSubmit = async () => {
  try {
    const formData = new FormData()
    formData.append('logo', logoFile.value);
    let input = {
      'logo': logoFile.value,
      'name': companyData.value.name,
      'website': companyData.value.website,
      'cmp_email': companyData.value.cmp_email,
      'location': companyData.value.location,
      'is_active': companyData.value.is_active ? 1 : 0,
      'cmp_admin_first_name': cmpAdminData.value.cmp_admin_first_name,
      'cmp_admin_last_name': cmpAdminData.value.cmp_admin_last_name,
      'cmp_admin_email': cmpAdminData.value.cmp_admin_email,
      'cmp_admin_password': cmpAdminData.value.cmp_admin_password,
      'cmp_admin_joining_date': cmpAdminData.value.cmp_admin_joining_date,
    }
    isEditing.value = props.companyId ? true : false
    const url = props.companyId ? `http://127.0.0.1:8000/api/company/update/${props.companyId}` : `http://127.0.0.1:8000/api/company/create`
    const response = await axios.post(url, input, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        'content-type': 'multipart/form-data'
      }
    });
    if (response.data.status == '200') {
      isEditing.value = false
      console.log(response.data.message)
      closeNavigationDrawer()
    } else {
      refForm.value?.reset()
      refForm.value?.resetValidation()
    }
  } catch (error) {
    console.error("Error submitting data:", error)
  }
};

watchEffect(() => {
  if (props.companyId) {
    isEditing.value = true
    getCompanyId.value = props.companyId
    // fetch company details
    getCompanyData(props.companyId)
  } else {
    isEditing.value = false
    getCompanyId.value = null
  }
})
</script>

<template>
  <VNavigationDrawer temporary :width="400" location="end" class="scrollable-content" :model-value="props.isDrawerOpen">
    <!-- 👉 Title -->
    <AppDrawerHeaderSection :title="isEditing ? 'Edit Company' : 'Add Company'" @cancel="closeNavigationDrawer" />
    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit" enctype="multipart/form-data">
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
              <VCol cols="12" v-if="!props.companyId">
                <VLabel class="text-subtitle-2 pb-4">Company Logo</VLabel>
                <input type="file" accept="image/*" @change="onLogoChange" label="Company Logo"
                  prepend-icon="mdi-camera" />
              </VCol>

              <VDivider class="my-4" />

              <!-- 👉 Company Admin First Name -->
              <VCol cols="12">
                <AppTextField v-model="cmpAdminData.cmp_admin_first_name" :rules="[requiredValidator]"
                  label="Company Admin First Name" />
              </VCol>

              <!-- 👉 Company Admin last Name -->
              <VCol cols="12">
                <AppTextField v-model="cmpAdminData.cmp_admin_last_name" :rules="[requiredValidator]"
                  label="Company Admin Last Name" />
              </VCol>

              <!-- 👉 Company Admin Email -->
              <VCol cols="12">
                <AppTextField v-model="cmpAdminData.cmp_admin_email" type="email"
                  :rules="[requiredValidator, emailValidator]" label="Company Admin Email" />
              </VCol>

              <!-- 👉 Company Admin Joining Date -->
              <VCol cols="12">
                <AppDateTimePicker v-model="cmpAdminData.cmp_admin_joining_date" label="Company Admin Joining Date"
                  placeholder="Select Joining date" :rules="[requiredValidator]" />
              </VCol>

              <!-- 👉 Company Admin password -->
              <VCol cols="12" v-if="!props.companyId">
                <AppTextField v-model="cmpAdminData.cmp_admin_password" type="password" :rules="[requiredValidator]"
                  label="Company Admin password" />
              </VCol>

              <!-- 👉 Company Status -->
              <VCol cols="12" v-if="props.companyId">
                <VSwitch label="Active" v-model="companyData.is_active" />
              </VCol>

              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn type="submit" class="me-3">
                  {{ isEditing ? `Edit` : `Create` }}
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