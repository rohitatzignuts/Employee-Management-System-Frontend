<script setup lang="ts">
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

interface Emit {
    (e: "closeDialog", value: Boolean): void;
    (e: "isApplicationEdited", value: Boolean): void;
}

interface Props {
    isDrawerOpen: boolean;
    applicationEditId: number | undefined

}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();
const access_token = localStorage.getItem("access_token");
const applicantStatusOptions = [
    'Accepted', 'Rejected', 'Pending'
]
const applicationData = ref({
    id: null,
    job_title: '',
    company_name: '',
    status: ''
})

const getApplicantsData = async (applicationId: number | undefined) => {
    try {
        const response = await axios.get(`/application/${applicationId}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })
        applicationData.value = response.data.data
    } catch (error) {
        console.log(error);
    }
}

const handleApplicationEdit = async () => {
    try {
        const status = applicationData.value.status
        const response = await axios.post(
            `/application/edit-${props.applicationEditId}`,
            { status },
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        )
        if (response) {
            toast(`${response.data.message}`, {
                type: "success",
            });
            emit('closeDialog',true)
            emit('isApplicationEdited',true)
        }
    } catch (error: any) {
        if (error.response) {
            toast(`${error.response.data.message}`, {
                type: "success",
            });
        }
    }
}

const closeNavigationDrawer = () => {
    emit("closeDialog", false);
    //   isEditing.value = false;

    //   nextTick(() => {
    //     refForm.value?.reset();
    //     empData.value.joining_date = null;
    //     refForm.value?.resetValidation();
    //   });
};

watchEffect(() => {
    if (props.applicationEditId) {
        getApplicantsData(props.applicationEditId)
    }
})
</script>

<template>
    <div>
        <VNavigationDrawer :model-value="props.isDrawerOpen" temporary :width="400" location="end"
            class="scrollable-content">
            <AppDrawerHeaderSection title="Edit Application" @cancel="closeNavigationDrawer" />
            <PerfectScrollbar :options="{ wheelPropagation: false }">
                <VCard flat>
                    <VCardText>
                        <VForm @submit.prevent="handleApplicationEdit">
                            <VRow>
                                <VCol cols="12">
                                    <AppTextField v-model="applicationData.id" label="Applicant ID" disabled />
                                </VCol>
                                <VCol cols="12">
                                    <AppTextField v-model="applicationData.company_name" label="Applied In" disabled />
                                </VCol>
                                <VCol cols="12">
                                    <AppTextField v-model="applicationData.job_title" label="Applied For" disabled />
                                </VCol>
                                <VCol cols="12">
                                    <AppSelect v-model="applicationData.status" :items="applicantStatusOptions"
                                        label="Applicant Status" placeholder="Change Status" />
                                </VCol>
                                <!-- 👉 Submit and Cancel -->
                                <VCol cols="12">
                                    <VBtn type="submit" class="me-3">Edit</VBtn>
                                    <VBtn type="reset" variant="tonal" color="secondary" @click="closeNavigationDrawer">
                                        Cancel
                                    </VBtn>
                                </VCol>
                            </VRow>
                        </VForm>
                    </VCardText>
                </VCard>
            </PerfectScrollbar>
        </VNavigationDrawer>

    </div>
</template>

<style lang="scss" scoped></style>
