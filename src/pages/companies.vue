<script setup lang="ts">
import AddNewCompanyDrawer from "../demos/forms/AddNewCompanyDrawer.vue";
import { VDataTable } from "vuetify/labs/VDataTable";
import axios from "axios";
import { ref, onMounted } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";

const companies = ref<Array<Object>>([]);
const isAddNewUserDrawerVisible = ref<boolean>(false);
const isLoading = ref<boolean>(true);
const companyEditId = ref<string | number | any>();

const headers = [
  { title: "NAME", key: "name" },
  { title: "EMAIL", key: "cmp_email" },
  { title: "LOCATION", key: "location" },
  { title: "ISACTIVE", key: "is_active" },
  { title: "Actions", key: "actions" },
];

const getAllCompanies = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/companies");
    if (response.data.length > 0) {
      companies.value = response.data;
    } else {
      console.log("No Companies For Now....");
    }
  } catch (error: any) {
    console.log(error.message);
  } finally {
    isLoading.value = false;
  }
};

const handleCompanyDelete = async (companyId: string | number) => {
  const access_token = localStorage.getItem("access_token");
  try {
    if (access_token) {
      Swal.fire({
        title: "Do You Really Want to Delete ?",
        showDenyButton: true,
        confirmButtonText: "YES !",
        denyButtonText: `NO !`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await axios.delete(
            `http://127.0.0.1:8000/api/company/${companyId}`,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          if (response.data.status === "200") {
            console.log("Company deleted successfully");
          }
        }
      });
    }
  } catch (error: any) {
    console.error("Error deleting company:", error.message);
  }
};

const createCompany = () => {
  isAddNewUserDrawerVisible.value = true;
  companyEditId.value = null;
};
const handleEditCompany = (companyId: string | number) => {
  isAddNewUserDrawerVisible.value = true;
  companyEditId.value = companyId;
};

const dialogClose = () => {
  isAddNewUserDrawerVisible.value = false
  companyEditId.value = null
  getAllCompanies()
}

onMounted(() => {
  getAllCompanies();
});

watchEffect(() => {
  getAllCompanies();
});
</script>

<template>
  <div>
    <div v-if="!isLoading">
      <div class="d-flex align-center justify-space-between">
        <h1>Companies</h1>
        <VBtn prepend-icon="tabler-plus" @click="createCompany">
          Add New Company
        </VBtn>
      </div>
      <VDivider class="my-4" />
      <VDataTable
        :headers="headers"
        :items="companies"
        :items-per-page="10"
        class="pa-3"
      >
        <template #item.is_active="{ item }">
          <div>
            <VChip color="success" v-if="item.props.title.is_active == 1">
              active
            </VChip>

            <VChip color="secondary" v-else> closed </VChip>
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
      <AddNewCompanyDrawer
        :is-drawer-open="isAddNewUserDrawerVisible"
        :company-id="companyEditId"
        @closeDialog="dialogClose"
      />
    </div>
    <VProgressLinear v-else indeterminate color="primary" />
  </div>
</template>
