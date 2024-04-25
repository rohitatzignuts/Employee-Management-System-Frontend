import axios from "axios";
import { useEmployeesStore } from "./useEmployeesStore";

export const useJobsStore = defineStore("jobs", () => {
    const eStore = useEmployeesStore();
    const isLoading = ref<boolean>(true);
    const totaljobs = ref<Array<Object>>([]);
    const totalJobsByCompanies = ref<Array<Object>>([]);
    const totalJobsCount = ref<number>(0);
    const totalJobsCountByCompany = ref<number>(0);
    const allJobTitles = ref<Array<string>>([])

    const getAllJobs = async (
        term: string | null = "",
        company: string | undefined = undefined
    ) => {
        try {
            const response = await axios.get(`jobs`, {
                params: {
                    term,
                    company,
                },
            });
            totaljobs.value = response.data.data ?? [];
            totalJobsCount.value = response.data.data?.length ?? 0;
        } catch (error) {
            console.error("Error fetching jobs", error);
        } finally {
            isLoading.value = false;
        }
    };

    const getJobsByCompany = async (term: string | null = "") => {
        const access_token = localStorage.getItem("access_token");
        const company_id = eStore.storedCmpId;
        try {
            const response = await axios.get(
                `${company_id}/jobs/search?term=${term}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            totalJobsByCompanies.value = response.data.data ?? [];
            totalJobsCountByCompany.value = response.data.data?.length ?? 0;
        } catch (error) {
            console.error("Error fetching jobs", error);
        } finally {
            isLoading.value = false;
        }
    };

    const getAllJobTitles = async () => { 
        try {
            const response = await axios.get('/jobs')
            allJobTitles.value = response.data.data.map((job:object) => {
                return job.title
            })
        } catch (error) {
            console.log(error);
        }
    };
    
    return {
        getAllJobs,
        totalJobsCount,
        allJobTitles,
        totaljobs,
        getJobsByCompany,
        getAllJobTitles,
        totalJobsCountByCompany,
        totalJobsByCompanies,
        isLoading,
    };
});
