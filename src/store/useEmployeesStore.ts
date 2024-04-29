import axios from "axios";
import CryptoJS from "crypto-js";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export const useEmployeesStore = defineStore("employees", () => {
    // get encrypted company name from database and decrypt it
    const decryptedCompany = CryptoJS.AES.decrypt(
        localStorage.getItem("company"),
        "company"
    ).toString(CryptoJS.enc.Utf8);
    const company = JSON.parse(decryptedCompany);
    const storedCmpId = company.id;
    const storedCmpName = [company.name];
    const employees = ref<Array<Object>>([]);
    const cmpEmployees = ref<Array<Object>>([]);
    const cmpEmployeeCount = ref<number>();

    // get all the employees ( super admin )
    const getAllEmployees = async (
        term: string | null = "",
        status: string | undefined = undefined
    ) => {
        const access_token = localStorage.getItem("access_token");
        try {
            const response = await axios.get(`employees`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                params: {
                    term,
                    status,
                },
            });
            employees.value = response.data.data ?? [];
        } catch (error: any) {
            if (error.response) {
                toast("Error : Failed to get the employees", {
                    type: "error",
                });
            }
        }
    };

    // get the employees of the logged in company admin
    const getCompanyEmployees = async (
        term: string | null = "",
        status: string | undefined = undefined
    ) => {
        const access_token = localStorage.getItem("access_token");
        try {
            const response = await axios.get(`${storedCmpId}/employees`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                params: {
                    term,
                    status,
                },
            });
            cmpEmployees.value = response.data.data ?? [];
            cmpEmployeeCount.value = response.data.data?.length ?? 0;
        } catch (error: any) {
            if (error.response) {
                toast("Error : Failed to get the employees", {
                    type: "error",
                });
            }
        }
    };

    return {
        getAllEmployees,
        getCompanyEmployees,
        employees,
        cmpEmployees,
        storedCmpId,
        storedCmpName,
        cmpEmployeeCount,
    };
});
