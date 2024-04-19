<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { useJobsStore } from "@/store/useJobsStore";
import AddNewJobDrawer from "../demos/forms/AddNewJobDrawer.vue";
import DeleteJobDialogBasic from "../demos/forms/DeleteJobDialogBasic.vue";
import { ref } from "vue";
import { useAuthStore } from "@/store/useAuthStore";
import { useCompanyStore } from "@/store/useCompanyStore";
import { storeToRefs } from "pinia";

// ref variables
const isAddNewUserDrawerVisible = ref<boolean>(false);
const jobEditid = ref<number | any>();
const jobDeleteid = ref<number | any>();
const deleteJobDialog = ref<boolean>(false);
const searchQuery = ref<string>("");
const selectCompanies = ref<Array<string>>([]);
const selectedCompany = ref<string | any>();

// constants
const jStore = useJobsStore();
const { totaljobs, totalJobsByCompanies } = storeToRefs(jStore);
const { getAllJobs, getJobsByCompany } = jStore;

const aStore = useAuthStore();
const { userRole } = aStore;

const cStore = useCompanyStore();
const { registeredCompanies, companies } = storeToRefs(cStore);
const { getAllRegisteredCompanies } = cStore;

const headers = [
    { title: "", key: "data-table-expand" },
    { title: "title", key: "title" },
    { title: "status", key: "is_active" },
    { title: "By", key: "company_name" },
    { title: "location", key: "location" },
    { title: "Actions", key: "actions" },
];

// handle job create
const handleJobCreate = () => {
    isAddNewUserDrawerVisible.value = true;
};

// handle job edit
const handleJobEdit = (id: number) => {
    jobEditid.value = id;
    isAddNewUserDrawerVisible.value = true;
};

// handle job delete
const handleJobDelete = (id: number) => {
    deleteJobDialog.value = true;
    jobDeleteid.value = id;
};

// when dialog is closed clear jobEditid and recall the jobs list
const dialogClose = (e: any) => {
    isAddNewUserDrawerVisible.value = false;
    jobEditid.value = null;
    if (e) {
        if (userRole === "admin") {
        getAllJobs();
        }
        getJobsByCompany();
    }
};

// handle job title search
const handleSearch = useDebounceFn(() => {
    if (userRole === "admin") {
        getAllJobs(searchQuery.value, selectedCompany.value);
    } else {
        getJobsByCompany(searchQuery.value);
    }
}, 500);

// assign value to the selectCompanies
watchEffect(() => {
    if (Array.isArray(registeredCompanies.value)) {
        selectCompanies.value = [...registeredCompanies.value];
    }
});

watch(selectedCompany, (newSelectedCompany, oldSelectedCompany) => {
    // Recall the handleSearch() when select item changes
    handleSearch();
});

// list all the jobs when the component first mounts
onMounted(() => {
    if (userRole === "admin") {
        getAllJobs();
    } else {
        getJobsByCompany();
    }
    if (companies.value.length > 1) {
        getAllRegisteredCompanies();
    }
});
</script>

<template>
    <div>
        <div class="d-flex align-center justify-space-between">
        <h1>Jobs</h1>
        <VBtn prepend-icon="tabler-plus" @click="handleJobCreate">
            Add New Job
        </VBtn>
        </div>
        <VDivider class="my-4" />
        <!-- 👉 Search and filter -->
        <VRow class="my-2">
        <VCol :cols="userRole === 'admin' ? 8 : 12">
            <div class="invoice-list-search">
            <AppTextField
                v-model="searchQuery"
                density="compact"
                prepend-inner-icon="tabler-search"
                placeholder="Search By Job Title"
                @input="handleSearch"
            />
            </div>
        </VCol>
        <VCol v-if="userRole === 'admin'" cols="4">
            <div>
            <AppSelect
                v-model="selectedCompany"
                :items="selectCompanies"
                clearable
                placeholder="Select Company"
            ></AppSelect>
            </div>
        </VCol>
        </VRow>

        <!-- show this if user is of type 'admin' -->
        <div v-if="userRole === 'admin'">
        <!-- 👉 data table for job data -->
        <VDataTable
            :headers="headers"
            :items="totaljobs"
            :items-per-page="10"
            expand-on-click
            class="pa-3"
        >
            <!-- 👉 template for job details  -->
            <template #expanded-row="slotProps">
            <tr class="v-data-table__tr">
                <td :colspan="headers.length">
                <h4 class="my-1">
                    Description: {{ slotProps.item.raw.description }}
                </h4>
                <p class="my-1">Pay: ${{ slotProps.item.raw.pay }}</p>
                </td>
            </tr>
            </template>
            <!-- 👉 template for job status  -->
            <template #item.is_active="{ item }">
            <div class="d-flex gap-1">
                <VChip v-if="item.raw.is_active === 0"> in-active </VChip>
                <VChip color="success" v-else> active </VChip>
            </div>
            </template>
            <!-- 👉 template for job actions edit/delete  -->
            <template #item.actions="{ item }">
            <div class="d-flex gap-1">
                <IconBtn @click="handleJobEdit(item.raw.id)">
                <VIcon icon="tabler-edit" />
                </IconBtn>
                <IconBtn @click="handleJobDelete(item.raw.id)">
                <VIcon icon="tabler-trash" />
                </IconBtn>
            </div>
            </template>
        </VDataTable>
        </div>

        <!-- show this if user is of type 'cmp_admin' -->
        <div v-if="userRole === 'cmp_admin'">
        <!-- 👉 data table for jobs data -->
        <VDataTable
            :headers="headers"
            :items="totalJobsByCompanies"
            :items-per-page="10"
            expand-on-click
            class="pa-3"
        >
            <!-- 👉 template for job description  -->
            <template #expanded-row="slotProps">
            <tr class="v-data-table__tr">
                <td :colspan="headers.length">
                <h4 class="my-1">
                    Description: {{ slotProps.item.raw.description }}
                </h4>
                <p class="my-1">Pay: ${{ slotProps.item.raw.pay }}</p>
                </td>
            </tr>
            </template>

            <!-- 👉 template for job status  -->
            <template #item.is_active="{ item }">
            <div class="d-flex gap-1">
                <VChip v-if="item.raw.is_active === 0"> in-active </VChip>
                <VChip color="success" v-else> active </VChip>
            </div>
            </template>

            <!-- 👉 template for job actions edit/delete  -->
            <template #item.actions="{ item }">
            <div class="d-flex gap-1">
                <IconBtn @click="handleJobEdit(item.raw.id)">
                <VIcon icon="tabler-edit" />
                </IconBtn>
                <IconBtn @click="handleJobDelete(item.raw.id)">
                <VIcon icon="tabler-trash" />
                </IconBtn>
            </div>
            </template>
        </VDataTable>
        </div>

        <!-- 👉 drawer for adding and editing jobs  -->
        <AddNewJobDrawer
        :is-drawer-open="isAddNewUserDrawerVisible"
        @close-dialog="dialogClose"
        :existing-job-id="jobEditid"
        @is-job-created="dialogClose"
        />
        <!-- 👉 dialog for deleting jobs -->
        <DeleteJobDialogBasic
        :isDialogVisible="deleteJobDialog"
        :delete-id="jobDeleteid"
        @isDeleteDialogVisible="deleteJobDialog = false"
        />
    </div>
</template>
