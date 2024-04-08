<script lang="ts" setup>
import { onMounted } from 'vue';
import { useCompanyStore } from '../store/useCompanyStore'

const store = useCompanyStore()

onMounted(() => {
  store.getAllCompanies();
  store.getAllJobs();
})
</script>

<template>
  <div>
    <div v-if="!store.isLoading">
      <VRow>
        <VCol cols="6">
          <RouterLink to="/companies">
            <VCard>
              <VCardTitle>
                <div>
                  <VIcon icon="mdi-office-building" /><span class="text-h1">{{ store.totalCompanies }}</span>
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
                <VIcon icon="mdi-file-account" /><span class="text-h1">{{ store.totalJobs }}</span>
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
