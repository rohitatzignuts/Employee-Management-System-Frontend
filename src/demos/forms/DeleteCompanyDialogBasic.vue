<script lang="ts" setup>
import axios from "axios";
import { ref } from "vue";
import { useCompanyStore } from "../../store/useCompanyStore";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const props = defineProps<{
  isDialogVisible: boolean;
  deleteId: number | undefined;
}>();

const emit = defineEmits<{
  (event: "isDeleteDialogVisible", payload: boolean): void;
}>();

const deleteTypeRef = ref<"permanent" | "temporary" | null>(null);
const store = useCompanyStore();

const handleConfirm = () => {
  // Emit the event to indicate delete confirmation with the selected deleteType
  emit("isDeleteDialogVisible", true);
};

const handleCancel = () => {
  // Emit the event to indicate cancel
  emit("isDeleteDialogVisible", false);
};

// handle item delete
const handleCompanyDelete = async (companyId: number | undefined) => {
  const access_token = localStorage.getItem("access_token");
  try {
    if (access_token) {
      const response = await axios.delete(`company/${companyId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          deleteType: deleteTypeRef.value,
        },
      });
      if (response) {
        // if delete is success full recall the companies list and show toast message
        store.getAllCompanies();
        toast(`${response.data.message}`, {
          type: "success",
        });
        // clear deleteTypeRef after deletion
        deleteTypeRef.value = null;
      }
    }
  } catch (error: any) {
    toast(`Error Deleting : ${error}`, {
      type: "success",
    });
  }
};
</script>

<template>
  <VDialog :model-value="isDialogVisible" width="500" persistent>
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="handleCancel" />

    <!-- Dialog Content -->
    <VCard title="How do you want to delete this record ?">
      <!-- Delete confirmation form  -->
      <VForm @submit.prevent="handleCompanyDelete(props.deleteId)">
        <VCardText class="demo-space-x">
          <!-- permanent checkbox  -->
          <VCheckbox
            v-model="deleteTypeRef"
            required
            value="permanent"
            label="Permanently"
            name="deleteType"
          />
          <!-- temporary checkbox  -->
          <VCheckbox
            v-model="deleteTypeRef"
            required
            value="temporary"
            label="Temporarily"
            name="deleteType"
          />
        </VCardText>
        <!-- Delete confirmation form  controls-->
        <VCardText class="d-flex justify-end gap-2">
          <VBtn type="submit" @click="handleConfirm"> Confirm </VBtn>
          <VBtn color="secondary" @click="handleCancel"> Cancel </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
