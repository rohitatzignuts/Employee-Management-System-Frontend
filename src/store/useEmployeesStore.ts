import axios from 'axios';
import CryptoJS from 'crypto-js';

export const useEmployeesStore = defineStore('employees', () => {

    const decryptedCompany = CryptoJS.AES.decrypt(localStorage.getItem('company'), "company").toString(CryptoJS.enc.Utf8)
    const company = JSON.parse(decryptedCompany)
    const storedCmpId = company.id 
    const storedCmpName = [company.name]    
    const employees = ref<Array<Object>>([])
    const cmpEmployees = ref<Array<Object>>([])

    const getAllEmployees = async () => {
        const access_token = localStorage.getItem("access_token");
        const response = await axios.get('employees', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })
        employees.value = response.data
    }

    const getCompanyEmployees = async () => {
        const access_token = localStorage.getItem("access_token");
        const response = await axios.get(`${storedCmpId}/employees`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })
        cmpEmployees.value = response.data
    }

    return {
        getAllEmployees,employees,getCompanyEmployees,cmpEmployees,storedCmpId,storedCmpName
    }
})