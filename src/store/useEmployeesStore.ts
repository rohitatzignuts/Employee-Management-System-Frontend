import axios from 'axios';

export const useEmployeesStore = defineStore('employees', () => {
    
    const employees = ref<Array<Object>>([])
    const getAllEmployees = async () => {
        const access_token = localStorage.getItem("access_token");
        const response = await axios.get('employees', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })
        employees.value = response.data
    }

    return {
        getAllEmployees,employees
    }
})