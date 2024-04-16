<script setup lang="ts">
import AddNewCompanyDrawer from "../demos/forms/AddNewCompanyDrawer.vue";
import DeleteCompanyDialogBasic from "../demos/forms/DeleteCompanyDialogBasic.vue";
import { VDataTable } from "vuetify/labs/VDataTable";
import { ref, onMounted } from "vue";
import { avatarText } from "@/@core/utils/formatters";
import { useCompanyStore } from '../store/useCompanyStore'
import misc404 from '@images/pages/404.png'
import { useAuthStore } from "@/store/useAuthStore";
import { useDebounceFn } from '@vueuse/core'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import miscMaskDark from '@images/pages/misc-mask-dark.png'
import miscMaskLight from '@images/pages/misc-mask-light.png'

const isAddNewUserDrawerVisible = ref<boolean>(false);
const companyEditId = ref<string | number | any>();
const deleteCompanyDialog = ref<boolean>(false)
const searchQuery = ref<string>('')
const store = useCompanyStore()
const aStore = useAuthStore()
const selectedStatus = ref<string|undefined>()

const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)
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

const handleSearch = useDebounceFn(() => {
  store.getAllCompanies(searchQuery.value,selectedStatus.value)
}, 500)

watch(selectedStatus, async(newSelectedStatus,oldSelectedStatus)=> {
  handleSearch()
})

onMounted(() => {
  store.getAllCompanies()
})
</script>

<template>
  <div>
    <div v-if="aStore.userRole === 'admin'">
      <div class="d-flex align-center justify-space-between">
        <h1>Companies</h1>
        <VBtn prepend-icon="tabler-plus" @click="createCompany">
          Add New Company
        </VBtn>
      </div>
      <VDivider class="my-4" />

      <!-- 👉 Search and filter -->
      <VRow class="my-2">
        <VCol cols="8">
          <div class="invoice-list-search">
            <AppTextField placeholder="Search By Name" density="compact"  v-model="searchQuery"
              @input="handleSearch" prepend-inner-icon="tabler-search" />
          </div>
        </VCol>
        <VCol cols="4">
          <AppSelect :items="['active','in-active']" placeholder="Status" clearable v-model="selectedStatus"/>
        </VCol>
      </VRow>


      <VDataTable :headers="headers" :items="store.companies" :items-per-page="10" class="pa-3">

        <template #item.is_active="{ item }">
          <div>
            <VChip color="success" v-if="item.props.title.is_active == 1">
              active
            </VChip>
            <VChip color="secondary" v-else> in-active </VChip>
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
      <DeleteCompanyDialogBasic :isDialogVisible="deleteCompanyDialog" :deleteId="companyEditId"
        @isDeleteDialogVisible="deleteCompanyDialog = false" />
    </div>
    <div v-else>
      <div class="misc-avatar w-100 text-center">
        <VCard class="pa-4">
          <VCardTitle class="font-weight-bold">Unauthorized</VCardTitle>
          <VDivider />
          <VImg :src="misc404" alt="Coming Soon" :max-width="200" class="mx-auto py-4" />
        </VCard>
      </div>
    </div>
  </div>
</template>
