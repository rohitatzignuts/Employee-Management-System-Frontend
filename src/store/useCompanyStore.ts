import axios from 'axios';

export const useCompanyStore = defineStore('companies', () => {

    const totalCompanies = ref<number>(0)
    const isLoading = ref<boolean>(true);
    const companies = ref<Array<Object>>([]);

    const getAllCompanies = async () => {
        const access_token = localStorage.getItem("access_token");
        try {
            const response = await axios.get('companies', {
                headers : {
                    Authorization: `Bearer ${access_token}`,
                }
            });
            if (response.data) {
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

    return {
        getAllCompanies, totalCompanies, isLoading, companies
    }
})