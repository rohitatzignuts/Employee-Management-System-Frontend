<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { VForm } from 'vuetify/components/VForm'
import axios from 'axios';
import { emailValidator, requiredValidator } from '../../@core/utils/validators'
import { ref, nextTick } from 'vue';

interface Emit {
  (e: 'update:isDrawerOpen', value: Boolean): void
}

interface Props {
  isDrawerOpen: boolean
  companyId ?: string|number
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const isFormValid = ref(false)
const refForm = ref<VForm>()
const getCompanyId = ref<string | number>()

const companyData = ref({
  'name': '',
  'logo': [],
  'website': '',
  'cmp_email': '',
  'location': '',
  'cmp_admin_first_name': '',
  'cmp_admin_last_name': '',
  'cmp_admin_email': '',
  'cmp_admin_password': '',
  'cmp_admin_joining_date': '',
  'emp_number': 0,  
})

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)

  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}

// 👉 get the company data on the basis of ID
const getCompanyData = async () => {
  if(props.companyId){
    getCompanyId.value = props.companyId
    try {
      const access_token = localStorage.getItem("access_token");
      const response = await axios.get(`http://127.0.0.1:8000/api/company/${getCompanyId.value}}`,{
        headers: {
          Authorization: `Bearer ${access_token}`,
          'content-type': 'multipart/form-data'
        }
      })
      companyData.value = response.data
    } catch (error) {
      console.error("Error submitting data:", error);
    }finally{
      getCompanyId.value = ''
    }
  }
}

// 👉 edit existig company and create a new company
const onSubmit = async () => {
  const access_token = localStorage.getItem("access_token");
  if (access_token) {

    try {
      const formData = new FormData();
      formData.append('name', companyData.value.name);
      formData.append('logo', companyData.value.logo[0]); 
      formData.append('website', companyData.value.website);
      formData.append('cmp_email', companyData.value.cmp_email);
      formData.append('location', companyData.value.location);
      formData.append('cmp_admin_first_name', companyData.value.cmp_admin_first_name);
      formData.append('cmp_admin_last_name', companyData.value.cmp_admin_last_name);
      formData.append('cmp_admin_email', companyData.value.cmp_admin_email);
      formData.append('cmp_admin_password', companyData.value.cmp_admin_password);
      formData.append('cmp_admin_joining_date', companyData.value.cmp_admin_joining_date);
      formData.append('emp_number',String(companyData.value.emp_number));

      let method = props.companyId ? 'put' : 'post'; // Assuming companyId is defined
      const url = props.companyId ? `http://127.0.0.1:8000/api/company/update/${props.companyId}` : `http://127.0.0.1:8000/api/company/create`;
      
      const response = await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'content-type': 'multipart/form-data'
        }
      });

      if (response.data.status == "200") {
        console.log(response.data.message);
        closeNavigationDrawer();
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      refForm.value?.reset();
      refForm.value?.resetValidation();
    }
  }
};

const handleDrawerModelValueUpdate = (val: boolean) => {
  emit('update:isDrawerOpen', val)
}

onMounted(() => {
  getCompanyData();
});

watch(() => props.companyId, (newId, oldId) => {
  getCompanyId.value = newId;
  getCompanyData()
});
</script>


<template>
  <VNavigationDrawer temporary :width="400" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">
    <!-- 👉 Title -->
    <AppDrawerHeaderSection :title=" props.companyId  ? 'Edit Company' : 'Add Company' " @cancel="closeNavigationDrawer" />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit" enctype="multipart/form-data" >
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
                <VFileInput v-model="companyData.logo" label="Company Logo" prepend-icon="mdi-camera"/>
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

              <!-- 👉 Company Admin Joining Date -->
              <VCol cols="12">
                <AppTextField v-model="companyData.cmp_admin_joining_date" type="date"
                  :rules="[requiredValidator]" label="Company Admin Joining Date" />
              </VCol>

              <!-- 👉 Company Admin Emp Number -->
              <VCol cols="12">
                <AppTextField v-model="companyData.emp_number" type="number"
                  :rules="[requiredValidator]" label="Company Admin Employee Number" />
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
                  {{ props.companyId ? `Edit` : `Create`}}
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
