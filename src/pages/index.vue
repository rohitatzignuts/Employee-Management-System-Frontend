<script lang="ts" setup>
import { onMounted } from 'vue';
import { useCompanyStore } from '../store/useCompanyStore'
import { useAuthStore } from '@/store/useAuthStore';
import { useEmployeesStore } from '@/store/useEmployeesStore';
import { useJobsStore } from '@/store/useJobsStore'

const store = useCompanyStore()
const username = localStorage.getItem('username')
const aStore = useAuthStore()
const eStore = useEmployeesStore()
const jStore = useJobsStore()

onMounted(() => {
  if (aStore.userRole === "admin") {
    store.getAllCompanies()
    jStore.getAllJobs();
  }
  eStore.getCompanyEmployees()
  jStore.getJobsByCompany()
})
</script>

<template>
  <div>

      <p class="text-h3 text-bold">Welcome 👋 <span class="font-weight-bold">{{ username }}</span></p>
      <VRow>
        <VCol cols="6">
          <!-- for super admin typeof user  -->
          <RouterLink to="/companies">
            <VCard v-if="aStore.userRole === 'admin'">
              <VCardTitle>
                <div>
                  <VIcon icon="mdi-office-building" /><span class="text-h1">{{ store.totalCompanies }}</span>
                </div>
              </VCardTitle>
              <VCardItem>
                Companies Registered
              </VCardItem>
            </VCard>
          </RouterLink>

          <!-- for cmp_admin typeof user  -->
          <VCard v-if="aStore.userRole === 'cmp_admin'">
            <VCardTitle>
              <div>
                <VIcon icon="mdi-office-building" /><span class="text-h1">{{ eStore.cmpEmployeeCount }}</span>
              </div>
            </VCardTitle>
            <VCardItem>
              Employees are regitered..
            </VCardItem>
          </VCard>
          <!--  -->

        </VCol>
        <VCol cols="6">
          <!-- for super admin typeof user  -->
          <VCard v-if="aStore.userRole === 'admin'">
            <VCardTitle>
              <div>
                <VIcon icon="mdi-file-account" /><span class="text-h1">{{ jStore.totalJobsCount }}</span>
              </div>
            </VCardTitle>
            <VCardItem>
              Jobs Listed
            </VCardItem>
          </VCard>

          <!-- for cmp_admin typeof user  -->
          <VCard v-if="aStore.userRole === 'cmp_admin'">
            <VCardTitle>
              <div>
                <VIcon icon="mdi-file-account" /><span class="text-h1">{{ jStore.totalJobsCountByCompany }}</span>
              </div>
            </VCardTitle>
            <VCardItem>
              Jobs Listed
            </VCardItem>
          </VCard>
        </VCol>
      </VRow>

  </div>
</template>
