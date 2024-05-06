import axios from 'axios'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export const useApplicationStore = defineStore('applications', () => {
	const access_token = localStorage.getItem('access_token')
	// array to store all applicants list
	const applicantsList = ref<Array<object>>()
	// array to store all applicants list by the company
	const applicantsListByCompany = ref<Array<object>>()

	// get the list of all the applicants
	const getAllApplicants = async (jobTitle?: string, status?: string) => {
		try {
			const response = await axios.get('companies/applications/all', {
				headers: {
					Authorization: `Bearer ${access_token}`
				},
				params: {
					jobTitle,
					status
				}
			})
			applicantsList.value = response.data.data
		} catch (error: any) {
			if (error.response) {
				toast('Error : Failed to get the applicants', {
					type: 'error'
				})
			}
		}
	}

	// get the list of all the applicants by company
	const getAllApplicantsByCompany = async (
		id: number | undefined,
		status?: string
	) => {
		try {
			const response = await axios.get(`companies/${id}/applications`, {
				headers: {
					Authorization: `Bearer ${access_token}`
				},
				params: {
					status
				}
			})
			applicantsListByCompany.value = response.data.data
		} catch (error: any) {
			if (error.response) {
				toast('Error : Failed to get the applicants', {
					type: 'error'
				})
			}
		}
	}

	return {
		getAllApplicants,
		getAllApplicantsByCompany,
		applicantsList,
		applicantsListByCompany
	}
})
