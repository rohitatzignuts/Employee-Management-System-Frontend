import axios from "axios"
import { useEmployeesStore } from "./useEmployeesStore";

export const useJobsStore = defineStore("jobs", () => {
    const eStore = useEmployeesStore()
    const isLoading = ref<boolean>(true);
    const totaljobs = ref<Array<Object>>([])
    const totalJobsByCompanies = ref<Array<Object>>([])
    const totalJobsCount = ref<number>(0)
    const totalJobsCountByCompany = ref<number>(0)

    const getAllJobs = async (term: string | null = '') => {
        try {
            const response = await axios.get(`jobs/search?term=${term}`)
            totaljobs.value = response.data
            totalJobsCount.value = response.data.length
        } catch (error) {
            console.error('Error fetching jobs', error)
        } finally {
            isLoading.value = false
        }
    }

    const getJobsByCompany = async (term: string | null = '') => {
        const access_token = localStorage.getItem("access_token");
        const company_id = eStore.storedCmpId
        try {
            const response = await axios.get(`${company_id}/jobs/search?term=${term}`,{
                headers : {
                    Authorization: `Bearer ${access_token}`,
                }
            })
            totalJobsByCompanies.value = response.data
            totalJobsCountByCompany.value = response.data.length
            
        } catch (error) {
            console.error('Error fetching jobs', error)
        } finally {
            isLoading.value = false
        }
    }

    return {
        getAllJobs, totalJobsCount, totaljobs, getJobsByCompany, totalJobsCountByCompany, totalJobsByCompanies, isLoading
    }
})