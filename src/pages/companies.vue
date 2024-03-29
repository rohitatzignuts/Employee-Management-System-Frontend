<script setup lang="ts">
  import AddNewCompanyDrawer from '../demos/forms/AddNewCompanyDrawer.vue'
  import { VDataTable } from "vuetify/labs/VDataTable";
  import axios from 'axios';
  import { ref, onMounted } from "vue";

  const companies = ref<Array<Object>>([])
  const isAddNewUserDrawerVisible = ref<Boolean>(false)
  const isLoading = ref<boolean>(true);
  const companyEditId = ref<string | number>()
  const headers = [
    { title: 'NAME', key: 'name' },
    { title: 'EMAIL', key: 'cmp_email' },
    { title: 'Actions', key: 'actions' },
  ]

  const getAllCompanies = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/companies');
      if(response.data.length > 0){
        companies.value =  response.data;
      }else{
        console.log('No Companies For Now....');
      }
    } catch (error : any) {
      console.log(error.message);
    }finally{
      isLoading.value = false;
    }
  }

  const handleEditCompany = (companyId : string|number) =>{
    isAddNewUserDrawerVisible.value = true;
    companyEditId.value = companyId;
  }

  onMounted(() =>{
    getAllCompanies()
  })

  watchEffect(() => {
    getAllCompanies()
  })
</script>

<template>
  <div>
    <div v-if="!isLoading">
      <div class="d-flex align-center justify-space-between">
        <h1>Companies</h1>
        <VBtn
          prepend-icon="tabler-plus"
          @click="isAddNewUserDrawerVisible = true">
          Add New Company
        </VBtn>
      </div>
      <VDivider class="my-4"/>
      <VDataTable
        :headers="headers"
        :items="companies"
        :items-per-page="10" 
        class="pa-3"
      >
      <template #item.actions="{ item }">
          <div class="d-flex gap-1">
            <IconBtn @click="handleEditCompany(item.props.title.id)">
              <VIcon icon="tabler-edit" />
            </IconBtn>
            <IconBtn @click="">
              <VIcon icon="tabler-trash" />
            </IconBtn>
          </div>
      </template>
      </VDataTable>
      <AddNewCompanyDrawer v-model:isDrawerOpen="isAddNewUserDrawerVisible" :company-id="companyEditId"/>
    </div>
    <VProgressLinear v-else indeterminate color="primary" />
  </div>
</template>
