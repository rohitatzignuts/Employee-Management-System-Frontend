<script setup lang="ts">
import { onMounted } from "vue";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useApplicationStore } from "../store/useApplicationStore"
import { useEmployeesStore } from "../store/useEmployeesStore"
import { useAuthStore } from "../store/useAuthStore"
import { useJobsStore } from "../store/useJobsStore"
import { storeToRefs } from "pinia";
import EditApplicantsDrawer from '../demos/forms/EditApplicantsDrawer.vue'
import DeleteJobApplicationDialogBasic from '../demos/forms/DeleteJobApplicationDialogBasic.vue'
import { ref } from "vue";

const editApplicantDrawer = ref<boolean>(false);
const deleteApplicantDialog = ref<boolean>(false);
const applicationEditId = ref<number | undefined | null>(null)
const applicationDeleteId = ref<number | undefined | null>(null)
const selectedJobTitle = ref<string>('')
const selectedApplicationStatus = ref<string>('')

const headers = [
    { title: "Applicant Id", key: "user_id" },
    { title: "Job Title", key: "job_title" },
    { title: "company", key: "company_name" },
    { title: "status", key: "status" },
    { title: "resume", key: "resume" },
    { title: "Actions", key: "actions" },
];

const appStore = useApplicationStore()
const { getAllApplicants, getAllApplicantsByCompany } = appStore
const { applicantsList, applicantsListByCompany } = storeToRefs(appStore)
const authStore = useAuthStore();
const { userRole } = authStore;
const empStore = useEmployeesStore()
const { storedCmpId } = empStore
const jobStore = useJobsStore()
const { getAllJobTitles } = jobStore

// select the color for the chips on the basis of appliaction status
const statusChipColor = (value: string) => value === 'Accepted' ? 'success' : value === 'Rejected' ? 'error' : 'secondary';

const dialogClose = (e: any) => {
    editApplicantDrawer.value = false
    applicationEditId.value = null
    // call the api only if user has performed any tasks
    if (e) {
        if (userRole === 'admin') {
            getAllApplicants()
        } else {
            getAllApplicantsByCompany(storedCmpId)
        }
    }
};

const handleApplicantEdit = (id: number) => {
    editApplicantDrawer.value = true
    applicationEditId.value = id
}

const handleApplicantDelete = (id: number) => {
    deleteApplicantDialog.value = true
    applicationDeleteId.value = id
}

watch([selectedJobTitle, selectedApplicationStatus], ([newSelectedJobTitle, newSelectedApplicationStatus], [oldSelectedJobTitle, oldSelectedApplicationStatus]) => {
    // Recall the handleSearch() when select item changes
    if (userRole === 'admin') {
        getAllApplicants(newSelectedJobTitle,newSelectedApplicationStatus);
    } else {
        getAllApplicantsByCompany(storedCmpId, newSelectedApplicationStatus);
    }
});

onMounted(() => {
    if (userRole === 'admin') {
        getAllApplicants(selectedJobTitle.value, selectedApplicationStatus.value)
    } else {
        getAllApplicantsByCompany(storedCmpId,selectedApplicationStatus.value)
    }
    getAllJobTitles()
})
</script>

<template>
    <div>
        <div class="d-flex align-center justify-space-between">
            <h1>Applicants</h1>
        </div>
        <VDivider class="my-4" />
        <div v-if="userRole === 'admin'">
            <!-- 👉 table for dispalying all the applicants  -->
            <VDataTable :headers="headers" :items="applicantsList" :items-per-page="10" expand-on-click class="pa-3">
                <!-- 👉 template for applied job title  -->
                <template #item.job_title="{ item }">
                    <div>
                        {{ item.raw.job_title ?? 'Not Available' }}
                    </div>
                </template>
                <!-- 👉 template for applicant's resume  -->
                <template #item.resume="{ item }">
                    <div>
                        <a :href="`http://127.0.0.1:8000/storage/${item.raw.resume}`"
                            target="_blank"><strong>view</strong></a>
                    </div>
                </template>
                <!-- 👉 template for application status  -->
                <template #item.status="{ item }">
                    <VChip :color="statusChipColor(item.raw.status)">{{ item.raw.status }}</VChip>
                </template>
                <!-- 👉 template for application actions edit/delete  -->
                <template #item.actions="{ item }">
                    <div class="d-flex gap-1">
                        <IconBtn>
                            <VIcon icon="tabler-edit" @click="handleApplicantEdit(item.raw.id)" />
                        </IconBtn>
                        <IconBtn>
                            <VIcon icon="tabler-trash" @click="handleApplicantDelete(item.raw.id)" />
                        </IconBtn>
                    </div>
                </template>
            </VDataTable>
        </div>

        <!-- show all employees of all a perticular company  -->
        <div v-if="userRole === 'cmp_admin'">
            <VDataTable :headers="headers" :items="applicantsListByCompany" :items-per-page="10" expand-on-click
                class="pa-3">
                <!-- 👉 template for applied job title  -->
                <template #item.job_title="{ item }">
                    <div>
                        {{ item.raw.job_title ?? 'Not Available' }}
                    </div>
                </template>
                <!-- 👉 template for applicant's resume  -->
                <template #item.resume="{ item }">
                    <div>
                        <a :href="`http://127.0.0.1:8000/storage/${item.raw.resume}`"
                            target="_blank"><strong>view</strong></a>
                    </div>
                </template>
                <!-- 👉 template for application status  -->
                <template #item.status="{ item }">
                    <VChip :color="statusChipColor(item.raw.status)">{{ item.raw.status }}</VChip>
                </template>
                <!-- 👉 template for application actions edit/delete  -->
                <template #item.actions="{ item }">
                    <div class="d-flex gap-1">
                        <IconBtn>
                            <VIcon icon="tabler-edit" @click="handleApplicantEdit(item.raw.id)" />
                        </IconBtn>
                        <IconBtn>
                            <VIcon icon="tabler-trash" @click="handleApplicantDelete(item.raw.id)" />
                        </IconBtn>
                    </div>
                </template>
            </VDataTable>
        </div>

        <!-- drawer for updating applicant's status  -->
        <EditApplicantsDrawer :is-drawer-open="editApplicantDrawer" @close-dialog="dialogClose"
            :application-edit-id="applicationEditId" />
        <!-- dialog for deleting applicant's status  -->
        <DeleteJobApplicationDialogBasic :delete-id="applicationDeleteId" :is-dialog-visible="deleteApplicantDialog"
            @is-delete-dialog-visible="deleteApplicantDialog = false" />
    </div>
</template>