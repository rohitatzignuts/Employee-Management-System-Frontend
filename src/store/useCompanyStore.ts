import axios from 'axios'

export const useCompanyStore = defineStore('companies', () => {
	const totalCompanies = ref<number>(0)
	const isLoading = ref<boolean>(true)
	const companies = ref<Array<Object>>([])
	const access_token = localStorage.getItem('access_token')
	const registeredCompanies = ref<Array<string>>([])

	// get all the companys from the database
	const getAllCompanies = async (
		term: string | null = '',
		status: string | undefined = undefined
	) => {
		try {
			const response = await axios.get(`companies`, {
				headers: {
					Authorization: `Bearer ${access_token}`
				},
				params: {
					term,
					status
				}
			})
			if (response.data) {
				companies.value = response.data.data
				totalCompanies.value = response.data.data?.length ?? 0
			} else {
				console.log('No Companies For Now....')
			}
		} catch (error: any) {
			console.log('Error fetching companies:', error)
		} finally {
			isLoading.value = false
		}
	}

	// get all the company names for filtering process
	const getAllRegisteredCompanies = async () => {
		try {
			const response = await axios.get('registeredCompanies')
			registeredCompanies.value = Array.from(new Set(response.data.data))
		} catch (error: any) {
			console.log(error)
		}
	}

	return {
		getAllCompanies,
		getAllRegisteredCompanies,
		totalCompanies,
		isLoading,
		companies,
		registeredCompanies
	}
})
