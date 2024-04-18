<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable"
import { useJobsStore } from '@/store/useJobsStore'
import AddNewJobDrawer from '../demos/forms/AddNewJobDrawer.vue'
import DeleteJobDialogBasic from '../demos/forms/DeleteJobDialogBasic.vue'
import { ref } from "vue"
import { useAuthStore } from '@/store/useAuthStore'
import { useCompanyStore } from "@/store/useCompanyStore"

// ref variables
const isAddNewUserDrawerVisible = ref<boolean>(false)
const jobEditid = ref<number | any>()
const jobDeleteid = ref<number | any>()
const deleteJobDialog = ref<boolean>(false)
const searchQuery = ref<string>('')
const selectCompanies = ref<Array<string>>([])
const selectedCompany = ref<string | any>()

// constants
const jStore = useJobsStore()
const aStore = useAuthStore()
const cStore = useCompanyStore()

const headers = [
    { title: '', key: 'data-table-expand' },
    { title: "title", key: "title", },
    { title: "status", key: "is_active", },
    { title: "By", key: "company_name" },
    { title: "location", key: "location" },
    { title: "Actions", key: "actions" },
]

// handle job create 
const handleJobCreate = () => {
    isAddNewUserDrawerVisible.value = true
}

// handle job edit 
const handleJobEdit = (id: number) => {
    jobEditid.value = id
    isAddNewUserDrawerVisible.value = true
}

// handle job delete 
const handleJobDelete = (id: number) => {
    deleteJobDialog.value = true
    jobDeleteid.value = id
}

// when dialog is closed clear jobEditid and recall the jobs list
const dialogClose = () => {
    isAddNewUserDrawerVisible.value = false
    jobEditid.value = null
    if (aStore.userRole === 'admin') {
        jStore.getAllJobs()
    }
    jStore.getJobsByCompany()
}

// handle job title search
const handleSearch = useDebounceFn(() => {
    if (aStore.userRole === 'admin') {
        jStore.getAllJobs(searchQuery.value, selectedCompany.value)
    } else {
        jStore.getJobsByCompany(searchQuery.value)
    }
}, 500)

// assign value to the selectCompanies
watchEffect(() => {
    selectCompanies.value = cStore.registeredCompanies
})

// recall the handleSearch() when select item changes
watch(selectedCompany, (newSelectedCompany, oldSelectedCompany) => {
    handleSearch()
})

// list all the jobs when the component first mounts
onMounted(() => {
    if (aStore.userRole === 'admin') {
        jStore.getAllJobs()
    }else{
        jStore.getJobsByCompany()
    }
    if(cStore.companies.length>1){
        cStore.getAllRegisteredCompanies()
    }
})
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
        <VRow class="my-2" v-if="jStore.totaljobs.length || jStore.totalJobsByCompanies.length">
            <VCol :cols="aStore.userRole === 'admin' ? 8 : 12">
                <div class="invoice-list-search">
                    <AppTextField placeholder="Search By Job Title" density="compact" v-model="searchQuery"
                        @input="handleSearch" prepend-inner-icon="tabler-search" />
                </div>
            </VCol>
            <VCol cols="4" v-if="aStore.userRole === 'admin'">
                <div>
                    <AppSelect :items="selectCompanies" placeholder="Select Company" clearable
                        v-model="selectedCompany"></AppSelect>
                </div>
            </VCol>
        </VRow>

        <!-- show this if user is of type 'admin' -->
        <div v-if="aStore.userRole === 'admin'">
            <!-- 👉 data table for job data -->
            <VDataTable :headers="headers" :items="jStore.totaljobs" :items-per-page="10" class="pa-3" expand-on-click>
                <!-- 👉 template for job details  -->
                <template #expanded-row="slotProps">
                    <tr class="v-data-table__tr">
                        <td :colspan="headers.length">
                            <h4 class="my-1">
                                Description: {{ slotProps.item.raw.description }}
                            </h4>
                            <p class="my-1">
                                Pay: ${{ slotProps.item.raw.pay }}
                            </p>
                        </td>
                    </tr>
                </template>
                <!-- 👉 template for job status  -->
                <template #item.is_active="{ item }">
                    <div class="d-flex gap-1">
                        <VChip v-if="item.raw.is_active === 0">
                            in-active
                        </VChip>
                        <VChip color="success" v-else>
                            active
                        </VChip>
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
        <div v-if="aStore.userRole === 'cmp_admin'">
            <!-- 👉 data table for jobs data -->
            <VDataTable :headers="headers" :items="jStore.totalJobsByCompanies" :items-per-page="10" class="pa-3"
                expand-on-click>
                <!-- 👉 template for job description  -->
                <template #expanded-row="slotProps">
                    <tr class="v-data-table__tr">
                        <td :colspan="headers.length">
                            <h4 class="my-1">
                                Description: {{ slotProps.item.raw.description }}
                            </h4>
                            <p class="my-1">
                                Pay: ${{ slotProps.item.raw.pay }}
                            </p>
                        </td>
                    </tr>
                </template>

                <!-- 👉 template for job status  -->
                <template #item.is_active="{ item }">
                    <div class="d-flex gap-1">
                        <VChip v-if="item.raw.is_active === 0">
                            in-active
                        </VChip>
                        <VChip color="success" v-else>
                            active
                        </VChip>
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
        <AddNewJobDrawer :is-drawer-open="isAddNewUserDrawerVisible" @close-dialog="dialogClose"
            :existing-job-id="jobEditid" />
        <!-- 👉 dialog for deleting jobs -->
        <DeleteJobDialogBasic :isDialogVisible="deleteJobDialog" :delete-id="jobDeleteid"
            @isDeleteDialogVisible="deleteJobDialog = false" />
    </div>
</template>
