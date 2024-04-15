<script lang="ts" setup>
import axios from 'axios';
import { ref } from 'vue';
import { useCompanyStore } from '../../store/useCompanyStore'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const props = defineProps<{
  isDialogVisible: boolean,
  deleteId: number | string
}>()

const emit = defineEmits<{
  (event: 'isDeleteDialogVisible', payload: boolean): void
}>()

const deleteTypeRef = ref<'permanent' | 'temporary' | null>(null);
const store = useCompanyStore()

const handleConfirm = () => {
  // Emit the event to indicate delete confirmation with the selected deleteType
  emit('isDeleteDialogVisible', true)
}

const handleCancel = () => {
  // Emit the event to indicate cancel
  emit('isDeleteDialogVisible', false)
}

const handleCompanyDelete = async (companyId: string | number) => {
  const access_token = localStorage.getItem("access_token");
  try {
    if (access_token) {
      const response = await axios.delete(`company/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          params: {
            deleteType: deleteTypeRef.value
          }
        }
      );
      if (response.data.status == "200") {
        store.getAllCompanies()
        toast(`${response.data.message}`, {
        "type": "success",
      })
        deleteTypeRef.value = null
      }
    }
  } catch (error: any) {
    toast(`Error Deleting : ${error}`, {
        "type": "success",
      })
  }
}
</script>

<template>
  <VDialog :model-value="isDialogVisible" width="500" persistent>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="handleCancel" />

    <!-- Dialog Content -->
    <VCard title="How do you want to delete this record ?">
      <VForm @submit.prevent="handleCompanyDelete(props.deleteId)">
        <VCardText class="demo-space-x">
          <VCheckbox v-model="deleteTypeRef" value="permanent" label="Permanently" name="deleteType" />
          <VCheckbox v-model="deleteTypeRef" value="temporary" label="Temporarily" name="deleteType" />
        </VCardText>
        <VCardText class="d-flex justify-end gap-2">
          <VBtn @click="handleConfirm" type="submit">
            Confirm
          </VBtn>
          <VBtn @click="handleCancel" color="secondary">
            Cancel
          </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
