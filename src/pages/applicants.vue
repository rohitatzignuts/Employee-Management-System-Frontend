<script setup lang="ts">
import { onMounted } from "vue";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useApplicationStore } from "../store/useApplicationStore"
import { storeToRefs } from "pinia";
import EditApplicantsDrawer from '../demos/forms/EditApplicantsDrawer.vue'
import { ref } from "vue";

const editApplicantDrawer = ref<boolean>(false);
const headers = [
    { title: "Applicant Id", key: "user_id"},
    { title: "company", key: "company_name" },
    { title: "status", key: "status" },
    { title: "resume", key: "resume" },
    { title: "Actions", key: "actions" },
];
const appStore = useApplicationStore()
const { getAllApplicants } = appStore
const { applicantsList } = storeToRefs(appStore)

const statusChipColor = (value: string) => value === 'Accepted' ? 'success' : value === 'Rejected' ? 'error' : 'secondary';

const handleApplicantEdit = (id :number) => {
    editApplicantDrawer.value = true
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
            <template #item.resume="{ item }">
                <div class="d-flex gap-1">
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
                        <VIcon icon="tabler-trash" />
                    </IconBtn>
                </div>
            </template>
        </VDataTable>
        <EditApplicantsDrawer :is-drawer-open="editApplicantDrawer" @close-dialog="editApplicantDrawer = false"/>
    </div>
</template>

<style scoped></style>