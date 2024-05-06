<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { VForm } from 'vuetify/components/VForm'
import axios from 'axios'
import { emailValidator, requiredValidator } from '../../@core/utils/validators'
import { ref, nextTick, watchEffect, onMounted } from 'vue'
import { useCompanyStore } from '../../store/useCompanyStore'
import { useEmployeesStore } from '../../store/useEmployeesStore'
import { useAuthStore } from '../../store/useAuthStore'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

interface Emit {
	(e: 'closeDialog', value: Boolean): void
	(e: 'isJobCreated', value: Boolean): void
}

interface Props {
	isDrawerOpen: boolean
	existingJobId?: number | undefined | null
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

// 👉 ref variables
const isEditing = ref<boolean>(false)
const isActionCanceled = ref<boolean>(true)
const isFormValid = ref<boolean>(false)
const refForm = ref<VForm>()
const getEmployeeId = ref<string | number | null>(props.existingJobId ?? null)
let resisteredCompanies = ref([])

const jobData = ref({
	title: '',
	description: '',
	location: '',
	pay: '',
	company_name: undefined,
	is_active: false,
	is_trending: false
})

// 👉 constants
const store = useCompanyStore()
const eStore = useEmployeesStore()
const aStore = useAuthStore()

// 👉 drawer close
const closeNavigationDrawer = () => {
	emit('closeDialog', false)
	isEditing.value = false

	nextTick(() => {
		refForm.value?.reset()
		refForm.value?.resetValidation()
	})
}

// 👉 get the company data on the basis of ID
const getJobData = async (jobId: string | number) => {
	try {
		const access_token = localStorage.getItem('access_token')
		const response = await axios.get(`jobs/${jobId}`, {
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		})
		jobData.value.title = response.data.data.title
		jobData.value.description = response.data.data.description
		jobData.value.location = response.data.data.location
		jobData.value.pay = response.data.data.pay
		jobData.value.company_name = response.data.data.company.name
		jobData.value.is_trending = response.data.data.is_trending
		getEmployeeId.value = null
		if (response.data.data.is_active) {
			jobData.value.is_active = true
		} else {
			jobData.value.is_active = false
		}
		if (response.data.data.is_trending) {
			jobData.value.is_trending = true
		} else {
			jobData.value.is_trending = false
		}
	} catch (error) {
		console.error('Error Getting data:', error)
	}
}

// 👉 edit existig company and create a new company
const onSubmit = async () => {
	try {
		// check form validation
		refForm.value?.validate().then(async (res) => {
			if (res.valid) {
				let input = {
					title: jobData.value.title,
					description: jobData.value.description,
					is_active: jobData.value.is_active ? 1 : 0,
					is_trending: jobData.value.is_trending ? 1 : 0,
					location: jobData.value.location,
					pay: jobData.value.pay,
					company_name: jobData.value.company_name
				}
				isEditing.value = props.existingJobId ? true : false
				//dynamiclly change main URL on the basis of 'props.employeeId'
				const url = props.existingJobId
					? `companies/jobs/update/${props.existingJobId}`
					: `companies/jobs/create`
				const response = await axios.post(url, input, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('access_token')}`
					}
				})
				if (response) {
					isEditing.value = false
					emit('isJobCreated', true)
					isActionCanceled.value = false
					toast(`${response.data.message}`, {
						type: 'success'
					})
					closeNavigationDrawer()
				} else {
					refForm.value?.reset()
					refForm.value?.resetValidation()
				}
			}
		})
	} catch (error: any) {
		if (error.response) {
			toast(`${error.response.data.message}`, {
				type: 'success'
			})
		}
	}
}

// is user is admin then show the option of multiple companies else show only one
watchEffect(() => {
	if (aStore.userRole === 'admin') {
		resisteredCompanies.value = store.companies.map((cmp) => cmp.name)
	} else {
		resisteredCompanies.value = eStore.storedCmpName
	}
})

watchEffect(() => {
	// Check if an job ID is provided
	if (props.existingJobId) {
		isEditing.value = true
		getEmployeeId.value = props.existingJobId
		// Fetch job details
		getJobData(props.existingJobId)
	} else {
		// Reset values if no job ID is provided
		isEditing.value = false
		getEmployeeId.value = null
	}
})

// get the jobs when the component mounts
onMounted(() => {
	store.getAllCompanies()
})
</script>

<template>
	<VNavigationDrawer
		:model-value="props.isDrawerOpen"
		temporary
		:width="400"
		location="end"
		class="scrollable-content"
	>
		<!-- 👉 Title -->
		<AppDrawerHeaderSection
			:title="isEditing ? 'Edit Job' : 'Add Job'"
			@cancel="closeNavigationDrawer"
		/>
		<PerfectScrollbar :options="{ wheelPropagation: false }">
			<VCard flat>
				<VCardText>
					<!-- 👉 Form -->
					<VForm
						ref="refForm"
						v-model="isFormValid"
						@submit.prevent="onSubmit"
						enctype="multipart/form-data"
					>
						<VRow>
							<!-- 👉 Job Title -->
							<VCol cols="12">
								<AppTextField
									v-model="jobData.title"
									:rules="[requiredValidator]"
									label="Job Title"
									placeholder="Job Title"
								/>
							</VCol>

							<!-- 👉 Job Description -->
							<VCol cols="12">
								<AppTextField
									v-model="jobData.description"
									:rules="[requiredValidator]"
									label="Job Description"
									placeholder="Job Description"
								/>
							</VCol>

							<!-- 👉 Job location -->
							<VCol cols="12">
								<AppTextField
									v-model="jobData.location"
									:rules="[requiredValidator]"
									type="email"
									label="Job Location"
									placeholder="Job Location"
								/>
							</VCol>

							<!-- 👉 Job pay -->
							<VCol cols="12">
								<AppTextField
									v-model="jobData.pay"
									:rules="[requiredValidator]"
									label="Job Pay"
									placeholder="﹩ Job Pay"
								/>
							</VCol>

							<!-- 👉From Company -->
							<VCol cols="12">
								<AppSelect
									v-model="jobData.company_name"
									:items="resisteredCompanies"
									:rules="[requiredValidator]"
									:disabled="!!props.existingJobId"
									required
									label="Companies"
									placeholder="Select Company"
								/>
							</VCol>

							<!-- 👉 Job Status -->
							<VCol cols="12" v-if="props.existingJobId">
								<VSwitch v-model="jobData.is_active" label="Active" />
							</VCol>

							<!-- 👉 is_trending -->
							<VCol cols="12" v-if="props.existingJobId">
								<VSwitch v-model="jobData.is_trending" label="Trending" />
							</VCol>

							<!-- 👉 Submit and Cancel -->
							<VCol cols="12">
								<VBtn type="submit" class="me-3">
									{{ isEditing ? `Edit` : `Create` }}
								</VBtn>

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
</template>
