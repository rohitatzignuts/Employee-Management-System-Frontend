import axios from "axios"

export const useJobsStore = defineStore("jobs", () => {
    const isLoading = ref<boolean>(true);
    const totaljobs = ref<Array<Object>>([])
    const totalJobsCount = ref<number>(0)
    const getAllJobs = async () => {
        try {
            const response = await axios.get('jobs')
            totaljobs.value = response.data
            totalJobsCount.value = response.data.length
        } catch (error) {
            console.error('Error fetching jobs', error)
        } finally {
            isLoading.value = false
        }
    }
    return {
        getAllJobs, totalJobsCount, totaljobs
    }
})