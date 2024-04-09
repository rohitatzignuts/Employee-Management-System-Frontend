<script lang="ts" setup>
import { onMounted } from 'vue';
import { useCompanyStore } from '../store/useCompanyStore'
import CryptoJS from 'crypto-js';

const store = useCompanyStore()
const username = localStorage.getItem('username')
const userRole = CryptoJS.AES.decrypt(localStorage.getItem('userRole'), "role").toString(CryptoJS.enc.Utf8)

onMounted(() => {
  if(userRole === "admin"){
    store.getAllCompanies()
  }
  store.getAllJobs();
})
</script>

<template>
  <div>
    <div v-if="!store.isLoading">
      <p class="text-h3 text-bold">Welcome 👋 <span class="font-weight-bold">{{ username }}</span></p>
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
