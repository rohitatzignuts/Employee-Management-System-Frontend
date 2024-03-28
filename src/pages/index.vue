<script lang="ts" setup>
import axios from 'axios';

const totalCompanies = ref<number>()
const totalJobs = ref<number>()

const getAllCompanies = async () => {
  const response = await axios.get('http://127.0.0.1:8000/api/companies');
  if(response.data.length < 0){
    return 'No Companies For Now....'
  }
  totalCompanies.value =  response.data.length;
}
const getAllJobs = async () => {
  const response = await axios.get('http://127.0.0.1:8000/api/jobs');
  if(response.data.length < 0){
    return '0 Jobs Posted For Now....'
  }
  totalJobs.value =  response.data.length;
}
onMounted(() =>{
  getAllCompanies(),
  getAllJobs()
})
</script>
<template>
  <div>
    <div>
      <VRow>
        <VCol cols="6">
          <VCard>
            <VCardTitle>
              <div><VIcon icon="mdi-office-building" /><span class="text-h1">{{totalCompanies}}</span></div>
            </VCardTitle>
            <VCardItem>
              Companies Registerd
            </VCardItem>
          </VCard>
        </VCol>
        <VCol cols="6">
          <VCard>
            <VCardTitle>
              <div><VIcon icon="mdi-file-account" /><span class="text-h1">{{totalJobs}}</span></div>
            </VCardTitle>
            <VCardItem>
              Jobs Listed
            </VCardItem>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </div>
</template>
