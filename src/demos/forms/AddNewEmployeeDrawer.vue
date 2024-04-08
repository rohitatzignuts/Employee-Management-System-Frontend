<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { VForm } from 'vuetify/components/VForm'
import axios from 'axios';
import { emailValidator, requiredValidator } from '../../@core/utils/validators'
import { ref, nextTick, watchEffect, computed, onMounted } from 'vue';
import { useCompanyStore } from '../../store/useCompanyStore'

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

const allCompanies = computed( () => {
  store.companies.map((cmp: { name: string; }) => cmp.name);
})
console.log(allCompanies);

const empData = ref({
  "first_name": "",
  "role": "",
  "email": "",
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
    const response = await axios.get(`employee/${empId}}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'content-type': 'multipart/form-data'
      }
    })
    empData.value.first_name = response.data.first_name;
    empData.value.email = response.data.email;
    empData.value.joining_date = response.data.joining_date;
    empData.value.role = response.data.role;
    getEmployeeId.value = null
  } catch (error) {
    console.error("Error submitting data:", error);
  }
}

// 👉 edit existig company and create a new company
const onSubmit = async () => {
  try {
    let input = {
      'first_name': empData.value.first_name,
      'email': empData.value.email,
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
              <!-- 👉 Company Admin First Name -->
              <VCol cols="12">
                <AppTextField v-model="empData.first_name" :rules="[requiredValidator]" label="First Name"
                  placeholder="First Name" />
              </VCol>

              <!-- 👉 Company Admin Email -->
              <VCol cols="12">
                <AppTextField v-model="empData.email" type="email" :rules="[requiredValidator, emailValidator]"
                  label="Email" placeholder="Email" />
              </VCol>

              <!-- 👉 Company Admin Joining Date -->
              <VCol cols="12">
                <AppDateTimePicker v-model="empData.joining_date" label="Joining Date" placeholder="Select Joining date"
                  :rules="[requiredValidator]" />
              </VCol>

              <!-- 👉 Company Admin role -->
              <VCol cols="12">
                <AppSelect label="Role" :items="empRoles" placeholder="Select Role" v-model="empData.role"/>
              </VCol>

              <VCol cols="12">
                <AppSelect label="Companies" :items="allCompanies" placeholder="Select Company" v-model="empData.company_name"/>
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