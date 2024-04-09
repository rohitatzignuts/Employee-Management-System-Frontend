<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { useEmployeesStore } from '../store/useEmployeesStore'
import { VDataTable } from "vuetify/labs/VDataTable"
import AddNewEmployeeDrawer from "../demos/forms/AddNewEmployeeDrawer.vue"
import DeleteEmployeeDialogBasic from '../demos/forms/DeleteEmployeeDialogBasic.vue'
const store = useEmployeesStore()
const isAddNewUserDrawerVisible = ref<boolean>(false)
const employeeEditid = ref<string | number | any>()
const employeeDeleteid = ref<string | number | any>()
const deleteCompanyDialog = ref<boolean>(false)

const headers = [
    { title: "NAME", key: "first_name", },
    { title: "EMAIL", key: "email" },
    { title: "COMPANY", key: "company_name" },
    { title: "EMP NUMBER", key: "emp_number" },
    { title: "ROLE", key: "role" },
    { title: "JOINING DATE", key: "joining_date" },
    { title: "Actions", key: "actions" },
];

const dialogClose = () => {
    isAddNewUserDrawerVisible.value = false
    employeeEditid.value = null
    store.getAllEmployees()
}

const handleEmployeeCreate = () => {
    isAddNewUserDrawerVisible.value = true;
    employeeEditid.value = null;
}

const handleEmployeeEdit = (employeeId : number) => {
    employeeEditid.value = employeeId
    isAddNewUserDrawerVisible.value = true;
}

const handleEmployeeDelete = (employeeId : number) => {
    employeeDeleteid.value = employeeId
    deleteCompanyDialog.value = true;
}

onMounted(() => {
    store.getAllEmployees();
});

watchEffect(() => {
    store.getAllEmployees();
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
        <VDataTable :headers="headers" :items="store.employees" :items-per-page="10" class="pa-3">
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
            <template #item.role="{ item }">
                <VChip :color="item.props.title.role === 'cmp_admin' ? 'primary' : 'success'">
                    {{ item.props.title.role }}
                </VChip>
            </template>
        </VDataTable>
        <AddNewEmployeeDrawer :employee-id="employeeEditid" :is-drawer-open="isAddNewUserDrawerVisible" @close-dialog="dialogClose"/>
        <DeleteEmployeeDialogBasic :isDialogVisible="deleteCompanyDialog" :employee-id="employeeDeleteid"
      @isDeleteDialogVisible="deleteCompanyDialog = false" />
    </div>
</template>
