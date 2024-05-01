<script lang="ts" setup>
import { onMounted } from "vue";
import { useCompanyStore } from "../store/useCompanyStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useEmployeesStore } from "@/store/useEmployeesStore";
import { useJobsStore } from "@/store/useJobsStore";
import { storeToRefs } from "pinia";

const store = useCompanyStore();
const { getAllCompanies } = store;
const { totalCompanies } = storeToRefs(store);
const username = localStorage.getItem("username");

const aStore = useAuthStore();
const { userRole } = aStore;

const eStore = useEmployeesStore();
const { getCompanyEmployees } = eStore;
const { cmpEmployeeCount } = storeToRefs(eStore);

const jStore = useJobsStore();
const { getAllJobs, getJobsByCompany } = jStore;
const { totalJobsCount, totalJobsCountByCompany } = storeToRefs(jStore);

// get the company and job count when the component
onMounted(() => {
  if (userRole === "admin") {
    getAllCompanies();
    getAllJobs();
  } else {
    getCompanyEmployees();
    getJobsByCompany();
  }
});
</script>

<template>
  <div>
    <p class="text-h3 text-bold">
      Welcome 👋 <span class="font-weight-bold">{{ username }}</span>
    </p>
    <VRow>
      <VCol cols="6">
        <!-- for super admin typeof user  -->
        <RouterLink to="/companies">
          <VCard v-if="userRole === 'admin'" variant="tonal">
            <VCardTitle>
              <!-- total companies count  -->
              <div>
                <VIcon icon="mdi-office-building" /><span class="text-h1">{{
                  totalCompanies
                }}</span>
              </div>
            </VCardTitle>
            <VCardItem> Companies Registered </VCardItem>
          </VCard>
        </RouterLink>

        <!-- for cmp_admin typeof user  -->
        <VCard v-if="userRole === 'cmp_admin'" variant="tonal">
          <VCardTitle>
            <!-- total employees count  -->
            <div>
              <VIcon icon="mdi-office-building" /><span class="text-h1">{{
                cmpEmployeeCount
              }}</span>
            </div>
          </VCardTitle>
          <VCardItem> Employees are regitered.. </VCardItem>
        </VCard>
      </VCol>
      <!--  -->

      <VCol cols="6">
        <!-- for super admin typeof user  -->
        <VCard v-if="userRole === 'admin'" variant="tonal">
          <VCardTitle>
            <!-- total job count  -->
            <div>
              <VIcon icon="mdi-file-account" /><span class="text-h1">{{
                totalJobsCount
              }}</span>
            </div>
          </VCardTitle>
          <VCardItem> Jobs Listed </VCardItem>
        </VCard>

        <!-- for cmp_admin typeof user  -->
        <VCard v-if="userRole === 'cmp_admin'" variant="tonal">
          <VCardTitle>
            <!-- total job count of the logged in company  -->
            <div>
              <VIcon icon="mdi-file-account" /><span class="text-h1">{{
                totalJobsCountByCompany
              }}</span>
            </div>
          </VCardTitle>
          <VCardItem> Jobs Listed </VCardItem>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped>
a {
  color: unset;
}
</style>
