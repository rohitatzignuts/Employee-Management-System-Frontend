<script setup lang="ts">
import AddNewCompanyDrawer from '../demos/forms/AddNewCompanyDrawer.vue'
import DeleteCompanyDialogBasic from '../demos/forms/DeleteCompanyDialogBasic.vue'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { ref, onMounted } from 'vue'
import { avatarText } from '@/@core/utils/formatters'
import { useCompanyStore } from '../store/useCompanyStore'
import misc404 from '@images/pages/404.png'
import { useAuthStore } from '@/store/useAuthStore'
import { useDebounceFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'

// ref variables
const isAddNewUserDrawerVisible = ref<boolean>(false)
const companyEditId = ref<number | undefined | null>(null)
const deleteCompanyDialog = ref<boolean>(false)
const searchQuery = ref<string>('')
const selectedStatus = ref<string | any>()

// constants
const store = useCompanyStore()
const { companies } = storeToRefs(store)
const { getAllCompanies } = store
const aStore = useAuthStore()
const { userRole } = aStore

const headers = [
	{ title: 'NAME', key: 'name' },
	{ title: 'EMAIL', key: 'cmp_email' },
	{ title: 'LOCATION', key: 'location' },
	{ title: 'STATUS', key: 'is_active' },
	{ title: 'Actions', key: 'actions' }
]

// handle create company
const createCompany = () => {
	isAddNewUserDrawerVisible.value = true
	companyEditId.value = null
}

// handle edit company
const handleEditCompany = (companyId: number) => {
	isAddNewUserDrawerVisible.value = true
	companyEditId.value = companyId
}

// handle delete company
const handleCompanyDelete = (companyId: number) => {
	deleteCompanyDialog.value = true
	companyEditId.value = companyId
}

// when dialog is closed clear companyEditId and recall the companies list
const dialogClose = (e: any) => {
	isAddNewUserDrawerVisible.value = false
	companyEditId.value = null
	// only call the api if user has performed any tasks
	if (e) {
		getAllCompanies()
	}
}

// handle company search
const handleSearch = useDebounceFn(() => {
	if (userRole === 'admin') {
		getAllCompanies(searchQuery.value, selectedStatus.value)
	}
}, 500)

// recall the handleSearch() when select item changes
watch(selectedStatus, async (newSelectedStatus, oldSelectedStatus) => {
	handleSearch()
})

// list all the companies when the component first mounts
onMounted(() => {
	if (userRole === 'admin') {
		getAllCompanies()
	}
})
</script>

<template>
	<div>
		<!-- 👉 make companies section visible to only super admin(admin) -->
		<div v-if="userRole === 'admin'">
			<div class="d-flex align-center justify-space-between">
				<h1>Companies</h1>
				<VBtn prepend-icon="tabler-plus" @click="createCompany">
					Add New Company
				</VBtn>
			</div>
			<VDivider class="my-4" />

			<!-- 👉 Search and filter -->
			<VRow class="my-2">
				<!-- 👉 searchbar for company name -->
				<VCol cols="8">
					<div class="invoice-list-search">
						<AppTextField
							v-model="searchQuery"
							density="compact"
							prepend-inner-icon="tabler-search"
							placeholder="Search By Name (min 3 chars) "
							@input="handleSearch"
						/>
					</div>
				</VCol>
				<!-- 👉 select menu for company status -->
				<VCol cols="4">
					<AppSelect
						v-model="selectedStatus"
						:items="['active', 'in-active']"
						clearable
						placeholder="Status"
					/>
				</VCol>
			</VRow>

			<!-- 👉 data table for companies data -->
			<VDataTable
				class="pa-3"
				:headers="headers"
				:items="companies"
				:items-per-page="10"
			>
				<!-- 👉 template for company status  -->
				<template #item.is_active="{ item }">
					<div>
						<VChip v-if="item.props.title.is_active == 1" color="success">
							active
						</VChip>
						<VChip v-else color="secondary"> in-active </VChip>
					</div>
				</template>

				<!-- 👉 template for company avatar  -->
				<template #item.name="{ item }">
					<div class="d-flex align-center">
						<!-- avatar -->
						<VAvatar
							:color="item.avatar ? '' : 'primary'"
							:class="item.avatar ? '' : 'v-avatar-light-bg primary--text'"
							:variant="!item.avatar ? 'tonal' : undefined"
							size="32"
						>
							<VImg
								v-if="item.props.title.logo"
								:src="`http://127.0.0.1:8000/storage/${item.props.title.logo}`"
							/>
							<span v-else>{{ avatarText(item.props.title.name) }}</span>
						</VAvatar>

						<div class="d-flex flex-column ms-3">
							<span
								class="d-block font-weight-medium text-high-emphasis text-truncate"
								>{{ item.props.title.name }}</span
							>
						</div>
					</div>
				</template>

				<!-- 👉 template for company actions edit/delete  -->
				<template #item.actions="{ item }">
					<div class="d-flex gap-1">
						<IconBtn @click="handleEditCompany(item.props.title.id)">
							<VIcon icon="tabler-edit" />
						</IconBtn>
						<IconBtn @click="handleCompanyDelete(item.props.title.id)">
							<VIcon icon="tabler-trash" />
						</IconBtn>
					</div>
				</template>
			</VDataTable>

			<!-- 👉 drawer for adding and editing companies  -->
			<AddNewCompanyDrawer
				:is-drawer-open="isAddNewUserDrawerVisible"
				:company-id="companyEditId"
				@closeDialog="dialogClose"
				@is-company-created="dialogClose"
			/>
			<!-- 👉 dialog for deleting companies -->
			<DeleteCompanyDialogBasic
				:isDialogVisible="deleteCompanyDialog"
				:deleteId="companyEditId"
				@isDeleteDialogVisible="deleteCompanyDialog = false"
			/>
		</div>

		<!-- 👉 show message and misc to the non admin user-->
		<div v-else>
			<div class="misc-avatar w-100 text-center">
				<VCard class="pa-4">
					<VCardTitle class="font-weight-bold">Unauthorized</VCardTitle>
					<VDivider />
					<VImg
						:src="misc404"
						:max-width="200"
						class="mx-auto py-4"
						alt="Coming Soon"
					/>
				</VCard>
			</div>
		</div>
	</div>
</template>
