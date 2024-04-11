<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable"
import { useJobsStore } from '@/store/useJobsStore'
import AddNewJobDrawer from '../demos/forms/AddNewJobDrawer.vue'
import DeleteJobDialogBasic from '../demos/forms/DeleteJobDialogBasic.vue'
import { ref } from "vue"

const isAddNewUserDrawerVisible = ref<Boolean>(false)
const jobEditid = ref<string | number | any>()
const jobDeleteid = ref<string | number | any>()
const deleteJobDialog = ref<boolean>(false)
const jStore = useJobsStore()
const headers = [
    { title: '', key: 'data-table-expand' },
    { title: "title", key: "title", },
    { title: "By", key: "company_name" },
    { title: "location", key: "location" },
    { title: "Actions", key: "actions" },
]

const handleJobCreate = () => {
    isAddNewUserDrawerVisible.value = true
}

const handleJobEdit = (id: string | number) => {
    jobEditid.value = id
    isAddNewUserDrawerVisible.value = true
}

const handleJobDelete = (id: string | number) => {
    deleteJobDialog.value = true
    jobDeleteid.value = id
}

const dialogClose = () => {
    isAddNewUserDrawerVisible.value = false
    jobEditid.value = null
    jStore.getAllJobs()
}

onMounted(() => {
    jStore.getAllJobs()
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
        <VDataTable :headers="headers" :items="jStore.totaljobs" :items-per-page="10" class="pa-3" expand-on-click>
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
        <AddNewJobDrawer :is-drawer-open="isAddNewUserDrawerVisible" @close-dialog="dialogClose"
            :existing-job-id="jobEditid" />
        <DeleteJobDialogBasic :isDialogVisible="deleteJobDialog" :delete-id="jobDeleteid"
            @isDeleteDialogVisible="deleteJobDialog = false" />
    </div>
</template>
