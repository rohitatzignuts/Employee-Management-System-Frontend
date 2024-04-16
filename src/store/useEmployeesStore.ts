import axios from 'axios';
import CryptoJS from 'crypto-js';

export const useEmployeesStore = defineStore('employees', () => {

    const decryptedCompany = CryptoJS.AES.decrypt(localStorage.getItem('company'), "company").toString(CryptoJS.enc.Utf8)
    const company = JSON.parse(decryptedCompany)
    const storedCmpId = company.id 
    const storedCmpName = [company.name]    
    const employees = ref<Array<Object>>([])
    const cmpEmployees = ref<Array<Object>>([])
    const cmpEmployeeCount = ref<number>()

    // get all the employees ( super admin )
    const getAllEmployees = async (term: string | null = '') => {
        const access_token = localStorage.getItem("access_token");
        try {
            const response = await axios.get(`employees/search?term=${term}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                }
            });
            employees.value = response.data;
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };
    

    // get the employees of the logged in company admin
    const getCompanyEmployees = async (term: string | null = '') => {
        const access_token = localStorage.getItem("access_token");
        try {
            const response = await axios.get(`${storedCmpId}/employees/search?term=${term}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                }
            });
            cmpEmployees.value = response.data.data;
            cmpEmployeeCount.value = response.data.data.length;
        } catch (error) {
            console.error('Error fetching company employees:', error);
        }
    };
    
    return {
        getAllEmployees,employees,getCompanyEmployees,cmpEmployees,storedCmpId,storedCmpName,cmpEmployeeCount
    }
})