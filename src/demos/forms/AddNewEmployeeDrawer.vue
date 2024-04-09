<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { VForm } from 'vuetify/components/VForm'
import axios from 'axios';
import { emailValidator, requiredValidator } from '../../@core/utils/validators'
import { ref, nextTick, watchEffect, computed, onMounted } from 'vue';
import { useCompanyStore } from '../../store/useCompanyStore'
import { get } from '@vueuse/core';

interface Emit {
  (e: 'closeDialog', value: Boolean): void
}

interface Props {
  isDrawerOpen: boolean
  employeeId?: string | number
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const store = useCompanyStore()
const isEditing = ref<Boolean>(false)
const isFormValid = ref(false)
const refForm = ref<VForm>()
const getEmployeeId = ref<string | number | null>(props.employeeId ?? null)
const empRoles = ['cmp_admin', 'employee']
let resisteredCompanies = ref([]);

const empData = ref({
  "first_name": "",
  "last_name": "",
  "role": "",
  "email": "",
  "password": "",
  "joining_date": "",
  "company_name": ""
})

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
const getEmployeeData = async (empId: string | number) => {
  try {
    const access_token = localStorage.getItem("access_token")
    const response = await axios.get(`employee/${empId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    })
    empData.value.first_name = response.data.employee.first_name;
    empData.value.last_name = response.data.employee.last_name;
    empData.value.email = response.data.employee.email;
    empData.value.joining_date = response.data.employee.joining_date;
    getEmployeeId.value = null
  } catch (error) {
    console.error("Error Getting data:", error);
  }
}

// 👉 edit existig company and create a new company
const onSubmit = async () => {
  try {
    let input = {
      'first_name': empData.value.first_name,
      'last_name': empData.value.last_name,
      'email': empData.value.email,
      'password': empData.value.password,
      'company_name': empData.value.company_name,
      'joining_date': empData.value.joining_date,
      'role': empData.value.role,
    }
    isEditing.value = props.employeeId ? true : false
    const url = props.employeeId ? `employee/update/${props.employeeId}` : `employee/create`
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
  resisteredCompanies.value = store.companies.map(cmp => cmp.name);
});

watchEffect(() => {
  if (props.employeeId) {
    isEditing.value = true
    getEmployeeId.value = props.employeeId
    // fetch company details
    getEmployeeData(props.employeeId)
  } else {
    isEditing.value = false
    getEmployeeId.value = null
  }
})

onMounted(() => {
  store.getAllCompanies()
})

</script>

<template>
  <VNavigationDrawer temporary :width="400" location="end" class="scrollable-content" :model-value="props.isDrawerOpen">
    <!-- 👉 Title -->
    <AppDrawerHeaderSection :title="isEditing ? 'Edit Employee' : 'Add Employee'" @cancel="closeNavigationDrawer" />
    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit" enctype="multipart/form-data">
            <VRow>
              <!-- 👉 Employee  First Name -->
              <VCol cols="12">
                <AppTextField v-model="empData.first_name" :rules="[requiredValidator]" label="First Name"
                  placeholder="First Name" />
              </VCol>

              <VCol cols="12">
                <AppTextField v-model="empData.last_name" :rules="[requiredValidator]" label="Last Name"
                  placeholder="Last Name" />
              </VCol>

              <!-- 👉 Employee  Email -->
              <VCol cols="12">
                <AppTextField v-model="empData.email" type="email" :rules="[requiredValidator, emailValidator]"
                  label="Email" placeholder="Email" />
              </VCol>

              <!-- 👉 Employee  Joining Date -->
              <VCol cols="12">
                <AppDateTimePicker v-model="empData.joining_date" label="Joining Date" placeholder="Select Joining date"
                  :rules="[requiredValidator]" />
              </VCol>

              <!-- 👉 Employee  role -->
              <VCol cols="12" v-if="!props.employeeId">
                <AppSelect label="Role" :items="empRoles" placeholder="Select Role" v-model="empData.role" required/>
              </VCol>

              <!-- 👉 Employee  password -->
              <VCol cols="12" v-if="!props.employeeId">
                <AppTextField v-model="empData.password" type="password" :rules="[requiredValidator]"
                  label="Employee password" placeholder="Employee password" />
              </VCol>

              <!-- 👉 Employee Company -->
              <VCol cols="12" v-if="!props.employeeId">
                <AppSelect label="Companies" :items="resisteredCompanies" placeholder="Select Company"
                  v-model="empData.company_name" required />
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