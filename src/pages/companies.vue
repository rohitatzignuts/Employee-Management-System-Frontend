<script setup lang="ts">
import AddNewUserDrawer from '../demos/forms/AddNewUserDrawer.vue'
import { VDataTable } from "vuetify/labs/VDataTable";
import axios from 'axios';
import { ref, onMounted } from "vue";

const companies = ref<Array<Object>>([])
const isAddNewUserDrawerVisible = ref<Boolean>(true)

const headers = [
  { title: 'NAME', key: 'name' },
  { title: 'EMAIL', key: 'cmp_email' },
  { title: 'Actions', key: 'actions' },
]
const getAllCompanies = async () => {
  const response = await axios.get('http://127.0.0.1:8000/api/companies');
  if(response.data.length > 0){
    companies.value =  response.data;
  } else {
    console.log('No Companies For Now....');
  }
}

onMounted(() =>{
  getAllCompanies()
})
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between">
      <h1>Companies</h1>
      <VBtn
                prepend-icon="tabler-plus"
                @click="isAddNewUserDrawerVisible = true"
              >
                Add New Company
              </VBtn>
    </div>
    <VDivider class="my-4"/>
    <VDataTable
      :headers="headers"
      :items="companies"
      :items-per-page="5" 
      class="pa-3"
    >
    <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <IconBtn @click="">
            <VIcon icon="tabler-edit" />
          </IconBtn>
          <IconBtn @click="">
            <VIcon icon="tabler-trash" />
          </IconBtn>
        </div>
      </template>
    </VDataTable>
  </div>
  <AddNewUserDrawer v-model:isDrawerOpen="isAddNewUserDrawerVisible"
          @user-data="companyData"/>
</template>
