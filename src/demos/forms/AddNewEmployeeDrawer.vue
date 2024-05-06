<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { VForm } from 'vuetify/components/VForm'
import axios from 'axios'
import { emailValidator, requiredValidator } from '../../@core/utils/validators'
import { ref, nextTick, watchEffect, computed, onMounted } from 'vue'
import { useCompanyStore } from '../../store/useCompanyStore'
import { useEmployeesStore } from '../../store/useEmployeesStore'
import { useAuthStore } from '../../store/useAuthStore'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

interface Emit {
	(e: 'closeDialog', value: Boolean): void
	(e: 'isEmployeeCreated', value: Boolean): void
}

interface Props {
	isDrawerOpen: boolean
	employeeId?: number | undefined | null
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

// 👉 ref variables
const isEditing = ref<Boolean>(false)
const isFormValid = ref(false)
const refForm = ref<VForm>()
const getEmployeeId = ref<string | number | null>(props.employeeId ?? null)
let resisteredCompanies = ref([])
const empData = ref({
	first_name: '',
	last_name: '',
	email: '',
	joining_date: null,
	company_name: undefined
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
		empData.value.joining_date = null
		refForm.value?.resetValidation()
	})
}

// 👉 get the company data on the basis of ID
const getEmployeeData = async (empId: undefined | null | number) => {
	try {
		const access_token = localStorage.getItem('access_token')
		const response = await axios.get(`companies/employees/${empId}`, {
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		})
		empData.value.first_name = response.data.data.first_name
		empData.value.last_name = response.data.data.last_name
		empData.value.email = response.data.data.email
		empData.value.joining_date = response.data.data.joining_date
		empData.value.company_name = response.data.data.company.name
		getEmployeeId.value = null
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
					first_name: empData.value.first_name,
					last_name: empData.value.last_name,
					email: empData.value.email,
					company_name: empData.value.company_name,
					joining_date: empData.value.joining_date
				}
				isEditing.value = !!props.employeeId
				//dynamiclly change main URL on the basis of 'props.employeeId'
				const url = props.employeeId
					? `companies/employees/update/${props.employeeId}`
					: `companies/employees/create`
				const response = await axios.post(url, input, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('access_token')}`
					}
				})
				if (response) {
					isEditing.value = false
					emit('isEmployeeCreated', true)
					toast(`${response.data.message}`, {
						type: 'success'
					})
					closeNavigationDrawer()
				} else {
					toast(`${response.data.message}`, {
						type: 'error'
					})
					refForm.value?.reset()
					refForm.value?.resetValidation()
				}
			}
		})
	} catch (error) {
		toast(`${error}`, {
			type: 'error'
		})
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
	// Check if an employee ID is provided
	if (props.employeeId) {
		isEditing.value = true
		getEmployeeId.value = props.employeeId
		// Fetch employee details
		getEmployeeData(props.employeeId)
	} else {
		// Reset values if no employee ID is provided
		isEditing.value = false
		getEmployeeId.value = null
	}
})

// get the companies when the component mounts
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
			:title="isEditing ? 'Edit Employee' : 'Add Employee'"
			@cancel="closeNavigationDrawer"
		/>
		<PerfectScrollbar :options="{ wheelPropagation: false }">
			<VCard flat>
				<VCardText>
					<!-- 👉 Form -->
					<VForm
						ref="refForm"
						v-model="isFormValid"
						enctype="multipart/form-data"
						@submit.prevent="onSubmit"
					>
						<VRow>
							<!-- 👉 Employee  First Name -->
							<VCol cols="12">
								<AppTextField
									v-model="empData.first_name"
									:rules="[requiredValidator]"
									label="First Name"
									placeholder="First Name"
								/>
							</VCol>

							<VCol cols="12">
								<AppTextField
									v-model="empData.last_name"
									:rules="[requiredValidator]"
									label="Last Name"
									placeholder="Last Name"
								/>
							</VCol>

							<!-- 👉 Employee  Email -->
							<VCol cols="12">
								<AppTextField
									v-model="empData.email"
									:rules="[requiredValidator, emailValidator]"
									type="email"
									label="Email"
									placeholder="Email"
								/>
							</VCol>

							<!-- 👉 Employee  Joining Date -->
							<VCol cols="12">
								<AppDateTimePicker
									v-model="empData.joining_date"
									:rules="[requiredValidator]"
									label="Joining Date"
									placeholder="Select Joining date"
								/>
							</VCol>

							<!-- 👉 Employee Company -->
							<VCol cols="12">
								<AppSelect
									label="Companies"
									v-model="empData.company_name"
									:items="resisteredCompanies"
									:disabled="!!props.employeeId"
									:rules="[requiredValidator]"
									placeholder="Select Company"
								/>
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
