import axios from "axios";
import { useEmployeesStore } from "./useEmployeesStore";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export const useJobsStore = defineStore("jobs", () => {
    const eStore = useEmployeesStore();
    const isLoading = ref<boolean>(true);
    const totaljobs = ref<Array<Object>>([]);
    const totalJobsByCompanies = ref<Array<Object>>([]);
    const totalJobsCount = ref<number>(0);
    const totalJobsCountByCompany = ref<number>(0);
    const allJobTitles = ref<Array<string>>([]);
    const access_token = localStorage.getItem("access_token");

    // get all the jobs from the database
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
        } catch (error: any) {
            if (error.response) {
                toast("Error : Failed to get the jobs", {
                    type: "error",
                });
            }
        } finally {
            isLoading.value = false;
        }
    };

    // get all the jobs from the database by company
    const getJobsByCompany = async (term: string | null = "") => {
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
        } catch (error: any) {
            if (error.response) {
                toast("Error : Failed to get the jobs", {
                    type: "error",
                });
            }
        } finally {
            isLoading.value = false;
        }
    };

    // get all the job titles for filtering process
    const getAllJobTitles = async () => {
        try {
            const response = await axios.get("/jobs");
            allJobTitles.value = response.data.data.map((job: object) => {
                return job.title;
            });
        } catch (error) {
            console.log(error);
        }
    };

    return {
        getAllJobs,
        getJobsByCompany,
        getAllJobTitles,
        totalJobsCount,
        allJobTitles,
        totaljobs,
        totalJobsCountByCompany,
        totalJobsByCompanies,
        isLoading,
    };
});
