<script setup lang="ts">
import { onMounted } from "vue";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useApplicationStore } from "../store/useApplicationStore"
import { storeToRefs } from "pinia";
import EditApplicantsDrawer from '../demos/forms/EditApplicantsDrawer.vue'
import DeleteJobApplicationDialogBasic from '../demos/forms/DeleteJobApplicationDialogBasic.vue'
import { ref } from "vue";

const editApplicantDrawer = ref<boolean>(false);
const deleteApplicantDialog = ref<boolean>(false);
const applicationEditId = ref<number | undefined>()
const applicationDeleteId = ref<number | undefined>()
const headers = [
    { title: "Applicant Id", key: "user_id"},
    { title: "Job Title", key: "job_title"},
    { title: "company", key: "company_name" },
    { title: "status", key: "status" },
    { title: "resume", key: "resume" },
    { title: "Actions", key: "actions" },
];
const appStore = useApplicationStore()
const { getAllApplicants } = appStore
const { applicantsList } = storeToRefs(appStore)

const statusChipColor = (value: string) => value === 'Accepted' ? 'success' : value === 'Rejected' ? 'error' : 'secondary';

const dialogClose = (e: any) => {
    editApplicantDrawer.value = false
    applicationEditId.value = undefined
    if (e) {
        getAllApplicants()
    }
};

const handleApplicantEdit = (id :number) => {
    editApplicantDrawer.value = true
    applicationEditId.value = id
}

const handleApplicantDelete = (id:number) => {
    deleteApplicantDialog.value = true
    applicationDeleteId.value = id
}
onMounted(() => {
    getAllApplicants()
})
</script>

<template>
    <div>
        <div class="d-flex align-center justify-space-between">
            <h1>Applicants</h1>
        </div>
        <VDivider class="my-4" />
        <VDataTable :headers="headers" :items="applicantsList" :items-per-page="10" expand-on-click class="pa-3">
            <template #item.job_title="{ item }">
                <div>   
                    {{ item.raw.job_title ?? 'Not Available' }}
                </div>
            </template>
            <template #item.resume="{ item }">
                <div>
                    <a :href="`http://127.0.0.1:8000/storage/${item.raw.resume}`" target="_blank"><strong>view</strong></a>
                </div>
            </template>

            <template #item.status="{ item }">
                <VChip :color="statusChipColor(item.raw.status)">{{ item.raw.status }}</VChip>
            </template>

            <template #item.actions="{ item }">
                <div class="d-flex gap-1">
                    <IconBtn>
                        <VIcon icon="tabler-edit" @click="handleApplicantEdit(item.raw.id)"/>
                    </IconBtn>
                    <IconBtn>
                        <VIcon icon="tabler-trash" @click="handleApplicantDelete(item.raw.id)"/>
                    </IconBtn>
                </div>
            </template>
        </VDataTable>
        <EditApplicantsDrawer :is-drawer-open="editApplicantDrawer" @close-dialog="dialogClose" :application-edit-id="applicationEditId" />
        <DeleteJobApplicationDialogBasic :delete-id="applicationDeleteId" :is-dialog-visible="deleteApplicantDialog" @is-delete-dialog-visible="deleteApplicantDialog = false"/>
    </div>
</template>

<style scoped></style>