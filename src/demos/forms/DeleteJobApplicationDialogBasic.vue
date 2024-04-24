<script lang="ts" setup>
import axios from "axios";
import { ref } from "vue";
import { useApplicationStore } from "../../store/useApplicationStore";
import { toast } from "vue3-toastify";
import type { VForm } from "vuetify/components/VForm";
import "vue3-toastify/dist/index.css";
import { requiredValidator } from "../../@core/utils/validators";

const props = defineProps<{
  isDialogVisible: boolean;
  deleteId: number | undefined;
}>();

const emit = defineEmits<{
  (event: "isDeleteDialogVisible", payload: boolean): void;
}>();

const isFormValid = ref<boolean>(false);
const refForm = ref<VForm>();
const deleteTypeRef = ref<"permanent" | "temporary" | null>(null);
const appStore = useApplicationStore();
const { getAllApplicants } = appStore;

const handleConfirm = () => {
  // Emit the event to indicate delete confirmation with the selected deleteType
  emit("isDeleteDialogVisible", true);
};

const handleCancel = () => {
  // Emit the event to indicate cancel
  emit("isDeleteDialogVisible", false);
};

// handle item delete
const handleJobDelete = async (applicationId: undefined | number) => {
  const access_token = localStorage.getItem("access_token");
  try {
    refForm.value?.validate().then(async (res) => {
      if (res.valid) {
        if (access_token) {
          const response = await axios.delete(`application/${applicationId}`, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
            params: {
              deleteType: deleteTypeRef.value,
            },
          });
          if (response) {
            // if delete is success full recall the companies list and show toast message
            getAllApplicants();
            handleConfirm();
            toast(`${response.data.message}`, {
              type: "success",
            });
            // clear deleteTypeRef after deletion
            deleteTypeRef.value = null;
          }
        }
      }
    });
  } catch (error: any) {
    if (error.response) {
      toast(`${error.response.data.message}`, {
        type: "error",
      });
    }
  }
};
</script>

<template>
  <VDialog :model-value="isDialogVisible" persistent width="500">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="handleCancel" />

    <!-- Dialog Content -->
    <VCard title="How do you want to delete this record ?">
      <!-- Delete confirmation form  -->
      <VForm
        v-model="isFormValid"
        ref="refForm"
        @submit.prevent="handleJobDelete(props.deleteId)"
      >
        <VCardText class="demo-space-x">
          <!-- permanent checkbox  -->
          <VCheckbox
            v-model="deleteTypeRef"
            :rules="[requiredValidator]"
            value="permanent"
            label="Permanently"
            name="deleteType"
          />
          <!-- temporary checkbox  -->
          <VCheckbox
            v-model="deleteTypeRef"
            :rules="[requiredValidator]"
            value="temporary"
            label="Temporarily"
            name="deleteType"
          />
        </VCardText>
        <!-- Delete confirmation form  controls-->
        <VCardText class="d-flex justify-end gap-2">
          <VBtn type="submit"> Confirm </VBtn>
          <VBtn color="secondary" @click="handleCancel"> Cancel </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
