<script setup lang="ts">
import AddNewCompanyDrawer from "../demos/forms/AddNewCompanyDrawer.vue";
import DeleteCompanyDialogBasic from "../demos/forms/DeleteCompanyDialogBasic.vue";
import { VDataTable } from "vuetify/labs/VDataTable";
import { ref, onMounted } from "vue";
import { avatarText } from "@/@core/utils/formatters";
import { useCompanyStore } from '../store/useCompanyStore'

const isAddNewUserDrawerVisible = ref<boolean>(false);
const companyEditId = ref<string | number | any>();
const deleteCompanyDialog = ref<boolean>(false)
const store = useCompanyStore()

const headers = [
  { title: "NAME", key: "name" },
  { title: "EMAIL", key: "cmp_email" },
  { title: "LOCATION", key: "location" },
  { title: "STATUS", key: "is_active" },
  { title: "Actions", key: "actions" },
];

const createCompany = () => {
  isAddNewUserDrawerVisible.value = true;
  companyEditId.value = null;
};
const handleEditCompany = (companyId: string | number) => {
  isAddNewUserDrawerVisible.value = true;
  companyEditId.value = companyId;
};

const handleCompanyDelete = (companyId: string | number) => {
  deleteCompanyDialog.value = true;
  companyEditId.value = companyId;
};

const dialogClose = () => {
  isAddNewUserDrawerVisible.value = false
  companyEditId.value = null
  store.getAllCompanies()
}

onMounted(() => {
  store.getAllCompanies()  
})

watchEffect(() => {
  store.getAllCompanies()
})
</script>

<template>
  <div>
    <div v-if="!store.isLoading">
      <div class="d-flex align-center justify-space-between">
        <h1>Companies</h1>
        <VBtn prepend-icon="tabler-plus" @click="createCompany">
          Add New Company
        </VBtn>
      </div>
      <VDivider class="my-4" />
      <VDataTable :headers="headers" :items="store.companies" :items-per-page="10" class="pa-3">

        <template #item.is_active="{ item }">
          <div>
            <VChip color="success" v-if="item.props.title.is_active == 1">
              active
            </VChip>
            <VChip color="secondary" v-else> closed </VChip>
          </div>
        </template>

        <template #item.name="{ item }">
          <div class="d-flex align-center">
            <!-- avatar -->
            <VAvatar size="32" :color="item.avatar ? '' : 'primary'"
              :class="item.avatar ? '' : 'v-avatar-light-bg primary--text'"
              :variant="!item.avatar ? 'tonal' : undefined">
              <VImg v-if="item.props.title.logo" :src="`http://127.0.0.1:8000/storage/${item.props.title.logo}`" />
              <span v-else>{{ avatarText(item.props.title.name) }}</span>
            </VAvatar>

            <div class="d-flex flex-column ms-3">
              <span class="d-block font-weight-medium text-high-emphasis text-truncate">{{ item.props.title.name
                }}</span>
            </div>
          </div>
        </template>


        <template #item.actions="{ item }">
          <div class="d-flex gap-1">
            <IconBtn @click="handleEditCompany(item.props.title.id)">
              <VIcon icon="tabler-edit" />
            </IconBtn>
            <IconBtn @click="handleCompanyDelete(item.props.title.id)">
              <VIcon icon="tabler-trash" />
            </IconBtn>
          </div>
        </template>

      </VDataTable>
      <AddNewCompanyDrawer :is-drawer-open="isAddNewUserDrawerVisible" :company-id="companyEditId"
        @closeDialog="dialogClose" />
    </div>
    <VProgressLinear v-else indeterminate color="primary" />
    <DeleteCompanyDialogBasic :isDialogVisible="deleteCompanyDialog" :deleteId="companyEditId"
      @isDeleteDialogVisible="deleteCompanyDialog = false" />
  </div>
</template>
