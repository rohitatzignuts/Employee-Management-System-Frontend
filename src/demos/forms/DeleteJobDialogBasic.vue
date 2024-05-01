<script lang="ts" setup>
import axios from 'axios'
import { ref } from 'vue'
import { useJobsStore } from '../../store/useJobsStore'
import { useCompanyStore } from '@/store/useCompanyStore'
import type { VForm } from 'vuetify/components/VForm'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { requiredValidator } from '../../@core/utils/validators'
import { useAuthStore } from '@/store/useAuthStore'

const props = defineProps<{
	isDialogVisible: boolean
	deleteId: number | undefined | null
}>()

const emit = defineEmits<{
	(event: 'isDeleteDialogVisible', payload: boolean): void
}>()

const refForm = ref<VForm>()
const isFormValid = ref<boolean>(false)
const deleteTypeRef = ref<'permanent' | 'temporary' | null>(null)

const store = useJobsStore()
const { getAllJobs, getJobsByCompany } = store
const cStore = useCompanyStore()
const { getAllRegisteredCompanies } = cStore
const authStore = useAuthStore()
const { userRole } = authStore

const handleConfirm = () => {
	// Emit the event to indicate delete confirmation with the selected deleteType
	emit('isDeleteDialogVisible', true)
}

const handleCancel = () => {
	// Emit the event to indicate cancel
	emit('isDeleteDialogVisible', false)
}

// handle item delete
const handleJobDelete = async (jobId: undefined | number | null) => {
	const access_token = localStorage.getItem('access_token')
	try {
		refForm.value?.validate().then(async (res) => {
			if (res.valid) {
				if (access_token) {
					const response = await axios.delete(`job/${jobId}`, {
						headers: {
							Authorization: `Bearer ${access_token}`
						},
						params: {
							deleteType: deleteTypeRef.value
						}
					})
					if (response) {
						// if delete is success full recall the companies list and show toast message
						if (userRole === 'admin') {
							getAllJobs()
						} else {
							getJobsByCompany()
						}
						getAllRegisteredCompanies()
						handleConfirm()
						toast(`${response.data.message}`, {
							type: 'success'
						})
						// clear deleteTypeRef after deletion
						deleteTypeRef.value = null
					}
				}
			}
		})
	} catch (error: any) {
		if (error.response) {
			toast(`${error.response.data.message}`, {
				type: 'error'
			})
		}
	}
}
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
