<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

interface Emit {
	(e: 'closeDialog', value: Boolean): void
	(e: 'isApplicationEdited', value: Boolean): void
}

interface Props {
	isDrawerOpen: boolean
	applicationEditId: number | undefined | null
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const applicationData = ref({
	id: null,
	job_title: '',
	company_name: '',
	status: ''
})

const access_token = localStorage.getItem('access_token')
const applicantStatusOptions = ['Accepted', 'Rejected', 'Pending']

// get applicant's data
const getApplicantsData = async (applicationId: number | undefined) => {
	try {
		const response = await axios.get(
			`companies/applications/${applicationId}`,
			{
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			}
		)
		applicationData.value.id = response.data.data.id
		applicationData.value.company_name = response.data.data.company.name
		applicationData.value.job_title = response.data.data.job.title
		applicationData.value.status = response.data.data.status
	} catch (error: any) {
		if (error.response) {
			toast('Error : Failed to get the Data 😓', {
				type: 'error'
			})
		}
	}
}

const handleApplicationEdit = async () => {
	try {
		const status = applicationData.value.status
		const response = await axios.post(
			`companies/applications/update/${props.applicationEditId}`,
			{ status },
			{
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			}
		)
		if (response) {
			toast(`${response.data.message}`, {
				type: 'success'
			})
			emit('closeDialog', true)
			emit('isApplicationEdited', true)
		}
	} catch (error: any) {
		if (error.response) {
			toast(`${error.response.data.message} 🙌`, {
				type: 'error'
			})
		}
	}
}

const closeNavigationDrawer = () => {
	emit('closeDialog', false)
}

watchEffect(() => {
	// get new application data when applicationEditId changes
	if (props.applicationEditId) {
		getApplicantsData(props.applicationEditId)
	}
})
</script>

<template>
	<div>
		<VNavigationDrawer
			:model-value="props.isDrawerOpen"
			temporary
			:width="400"
			location="end"
			class="scrollable-content"
		>
			<AppDrawerHeaderSection
				title="Edit Application"
				@cancel="closeNavigationDrawer"
			/>
			<PerfectScrollbar :options="{ wheelPropagation: false }">
				<VCard flat>
					<VCardText>
						<VForm @submit.prevent="handleApplicationEdit">
							<VRow>
								<!-- 👉 Applicant's ID -->
								<VCol cols="12">
									<AppTextField
										v-model="applicationData.id"
										disabled
										label="Applicant ID"
									/>
								</VCol>
								<!-- 👉 Company applied in -->
								<VCol cols="12">
									<AppTextField
										v-model="applicationData.company_name"
										disabled
										label="Applied In"
									/>
								</VCol>
								<!-- 👉 Position applied for -->
								<VCol cols="12">
									<AppTextField
										v-model="applicationData.job_title"
										disabled
										label="Applied For"
									/>
								</VCol>
								<!-- 👉 application status -->
								<VCol cols="12">
									<AppSelect
										v-model="applicationData.status"
										:items="applicantStatusOptions"
										label="Applicant Status"
										placeholder="Change Status"
									/>
								</VCol>
								<!-- 👉 Submit and Cancel -->
								<VCol cols="12">
									<VBtn type="submit" class="me-3">Edit</VBtn>
									<VBtn
										type="reset"
										variant="tonal"
										color="secondary"
										@click="closeNavigationDrawer"
									>
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
