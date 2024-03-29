<script lang="ts" setup>
import axios from 'axios';

const totalCompanies = ref<number>()
const totalJobs = ref<number>()
const isLoading = ref<boolean>(true);

const getAllCompanies = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/companies');
    totalCompanies.value = response.data.length;
  } catch (error) {
    console.error('Error fetching companies:', error);
  } finally {
    isLoading.value = false;
  }
}
const getAllJobs = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/jobs');
    totalJobs.value = response.data.length;
  } catch (error) {
    console.error('Error fetching jobs:', error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  getAllCompanies();
  getAllJobs();
})
</script>

<template>
  <div>
    <div v-if="!isLoading">
      <VRow>
        <VCol cols="6">
          <RouterLink to="/companies">
            <VCard>
              <VCardTitle>
                <div>
                  <VIcon icon="mdi-office-building" /><span class="text-h1">{{ totalCompanies }}</span>
                </div>
              </VCardTitle>
              <VCardItem>
                Companies Registerd
              </VCardItem>
            </VCard>
          </RouterLink>
        </VCol>
        <VCol cols="6">
          <VCard>
            <VCardTitle>
              <div>
                <VIcon icon="mdi-file-account" /><span class="text-h1">{{ totalJobs }}</span>
              </div>
            </VCardTitle>
            <VCardItem>
              Jobs Listed
            </VCardItem>
          </VCard>
        </VCol>
      </VRow>
    </div>
    <VProgressLinear v-else indeterminate color="primary" />
  </div>
</template>
