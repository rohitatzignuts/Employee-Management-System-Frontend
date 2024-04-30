<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { useEmployeesStore } from "@/store/useEmployeesStore";
import { VDataTable } from "vuetify/labs/VDataTable";
import AddNewEmployeeDrawer from "@/demos/forms/AddNewEmployeeDrawer.vue";
import DeleteEmployeeDialogBasic from "@/demos/forms/DeleteEmployeeDialogBasic.vue";
import { useAuthStore } from "@/store/useAuthStore";
import { storeToRefs } from "pinia";

// ref variables
const isAddNewUserDrawerVisible = ref<boolean>(false);
const employeeEditid = ref<number | undefined | null>(null);
const employeeDeleteid = ref<number | undefined | null>(null);
const deleteCompanyDialog = ref<boolean>(false);
const searchQuery = ref<string>("");
const selectedRole = ref<string>();

// constants
const store = useEmployeesStore();
const { employees, cmpEmployees } = storeToRefs(store);
const { getAllEmployees, getCompanyEmployees, storedCmpName } = store;
const aStore = useAuthStore();
const { userRole } = aStore;
const status = ["cmp_admin", "employee"];

const headers = [
  { title: "NAME", key: "first_name" },
  { title: "EMAIL", key: "email" },
  { title: "COMPANY", key: "company_name" },
  { title: "EMP NUMBER", key: "emp_number" },
  { title: "ROLE", key: "role" },
  { title: "JOINING DATE", key: "joining_date" },
  { title: "Actions", key: "actions" },
];

// when dialog is closed clear employeeEditid and recall the employees list
const dialogClose = (e: any) => {
  isAddNewUserDrawerVisible.value = false;
  employeeEditid.value = null;
  // only call the api if user has performed any actions
  if (e) {
    if (userRole === "admin") {
      getAllEmployees();
    }else{
      getCompanyEmployees();
    }
  }
};

// handle employee create
const handleEmployeeCreate = () => {
  isAddNewUserDrawerVisible.value = true;
  employeeEditid.value = null;
};

// handle employee edit
const handleEmployeeEdit = (employeeId: number) => {
  employeeEditid.value = employeeId;
  isAddNewUserDrawerVisible.value = true;
};

//handle employee delete
const handleEmployeeDelete = (employeeId: number) => {
  employeeDeleteid.value = employeeId;
  deleteCompanyDialog.value = true;
};

// handle employee search by name
const handleSearch = useDebounceFn(() => {
  if (userRole === "admin") {
    getAllEmployees(searchQuery.value, selectedRole.value);
  } else {
    getCompanyEmployees(searchQuery.value);
  }
}, 500);

// recall the handleSearch() when select item changes
watch(selectedRole, async (newSelectedRole, oldSelectedRole) => {
  handleSearch();
});

// list all the employees when the component first mounts
onMounted(() => {
  if (userRole === "admin") {
    getAllEmployees();
  } else {
    getCompanyEmployees();
  }
});
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between">
      <h1>Employees</h1>
      <VBtn prepend-icon="tabler-plus" @click="handleEmployeeCreate">
        Add New Employee
      </VBtn>
    </div>
    <VDivider class="my-4" />

    <!-- 👉 Search and filter -->
    <VRow class="my-2">
      <!-- 👉 search bar to search employee by his/her name -->
      <VCol :cols="userRole === 'admin' ? 8 : 12">
        <div class="invoice-list-search">
          <AppTextField
            v-model="searchQuery"
            density="compact"
            prepend-inner-icon="tabler-search"
            placeholder="Search By First Name"
            @input="handleSearch"
          />
        </div>
      </VCol>
      <!-- 👉 select menu to select employees role -->
      <VCol cols="4" v-if="userRole === 'admin'">
        <AppSelect
          v-model="selectedRole"
          :items="status"
          clearable
          placeholder="Role"
        ></AppSelect>
      </VCol>
    </VRow>

    <!-- show all employees of all the companies if user is Admin  -->
    <div v-if="userRole === 'admin'">
      <!-- 👉 data table employees data -->
      <VDataTable
        :headers="headers"
        :items="employees"
        :items-per-page="10"
        class="pa-3"
      >
        <!-- 👉 template for employee actions edit/delete -->
        <template #item.actions="{ item }">
          <div class="d-flex gap-1">
            <IconBtn @click="handleEmployeeEdit(item.props.title.id)">
              <VIcon icon="tabler-edit" />
            </IconBtn>
            <IconBtn @click="handleEmployeeDelete(item.props.title.id)">
              <VIcon icon="tabler-trash" />
            </IconBtn>
          </div>
        </template>
        <!-- 👉 template for employee role  -->
        <template #item.role="{ item }">
          <VChip
            :color="
              item.props.title.role === 'cmp_admin' ? 'primary' : 'success'
            "
          >
            {{ item.props.title.role }}
          </VChip>
        </template>
      </VDataTable>
    </div>
    <!--  -->

    <!-- show all employees of all a perticular company  -->
    <div v-if="userRole === 'cmp_admin'">
      <!-- 👉 data table employees data -->
      <VDataTable
        :headers="headers"
        :items="cmpEmployees"
        :items-per-page="10"
        class="pa-3"
      >
        <!-- 👉 template for employee actions edit/delete -->
        <template #item.actions="{ item }">
          <div class="d-flex gap-1">
            <IconBtn @click="handleEmployeeEdit(item.props.title.id)">
              <VIcon icon="tabler-edit" />
            </IconBtn>
            <IconBtn @click="handleEmployeeDelete(item.props.title.id)">
              <VIcon icon="tabler-trash" />
            </IconBtn>
          </div>
        </template>
        <!-- 👉 template for employee role  -->
        <template #item.role="{ item }">
          <VChip
            :color="
              item.props.title.role === 'cmp_admin' ? 'primary' : 'success'
            "
          >
            {{ item.props.title.role }}
          </VChip>
        </template>
        <!-- 👉 template for employee company name  -->
        <template #item.company_name="{ item }">
          {{ storedCmpName[0] }}
        </template>
      </VDataTable>
    </div>

    <!-- 👉 drawer for adding and editing employees  -->
    <AddNewEmployeeDrawer
      :employee-id="employeeEditid"
      :is-drawer-open="isAddNewUserDrawerVisible"
      @close-dialog="dialogClose"
      @is-employee-created="dialogClose"
    />
    <!-- 👉 dialog for deleting companies -->
    <DeleteEmployeeDialogBasic
      :isDialogVisible="deleteCompanyDialog"
      :employee-id="employeeDeleteid"
      @isDeleteDialogVisible="deleteCompanyDialog = false"
    />
  </div>
</template>
