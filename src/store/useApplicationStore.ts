import axios from "axios";
// import CryptoJS from "crypto-js";
// import router from '@/router'
// import { toast } from 'vue3-toastify';
// import 'vue3-toastify/dist/index.css';

export const useApplicationStore = defineStore("applications", () => {
    const access_token = localStorage.getItem("access_token");
    const applicantsList = ref<Array<object>>();
    const applicantsListByCompany = ref<Array<object>>();
    const getAllApplicants = async (jobTitle?:string,status?:string) => {
        try {
            const response = await axios.get("/applications", {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                params : {
                    jobTitle,status
                }
            });
            applicantsList.value = response.data.data;
        } catch (error: any) {
            if (error.response) {
                console.log(`${error.response.data.message}`);
            }
        }
    };

    const getAllApplicantsByCompany = async (id:number|undefined,status?:string) => {
        try {
            const response = await axios.get(`${id}/applications`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                params : {
                    status
                }
            });
            applicantsListByCompany.value = response.data.data;
        } catch (error: any) {
            if (error.response) {
                console.log(`${error.response.data.message}`);
            }
        }
    };
    
    return {
        applicantsList,
        applicantsListByCompany,
        getAllApplicants,
        getAllApplicantsByCompany,
    };
});
