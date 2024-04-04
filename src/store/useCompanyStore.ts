import axios from 'axios';

export const useCompanyStore = defineStore('companies', () => {

    const totalCompanies = ref<number>()
    const totalJobs = ref<number>()
    const isLoading = ref<boolean>(true);
    const companies = ref<Array<Object>>([]);

    const getAllCompanies = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/companies');
            if (response.data.length > 0) {
                companies.value = response.data;
                totalCompanies.value = response.data.length;
            } else {
                console.log('No Companies For Now....');
            }
        } catch (error: any) {
            console.log('Error fetching companies:', error.message);
        } finally {
            isLoading.value = false;
        }
    };

    const getAllJobs = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/jobs');
            totalJobs.value = response.data.length;
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            isLoading.value = false;
        }
    }
    return {
        getAllCompanies, getAllJobs, totalCompanies, totalJobs, isLoading, companies
    }
})