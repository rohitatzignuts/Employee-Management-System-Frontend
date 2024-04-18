import axios from "axios";
import CryptoJS from "crypto-js";
import router from '@/router'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export const useAuthStore = defineStore("auth", () => {
    const userRole = CryptoJS.AES.decrypt(localStorage.getItem('userRole'), "role").toString(CryptoJS.enc.Utf8)
    const username = localStorage.getItem("username");

    const handleLogout = async () => {
        const accessToken = localStorage.getItem("access_token");
        try {
            await axios.post(
                "logout",
                null, // No data to send in the request body
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            router.push("/login");
            localStorage.removeItem("access_token");
            localStorage.removeItem("userRole");
            localStorage.removeItem("username");
            localStorage.removeItem("company");
            toast("Logged Out Successfully !", {
                "type": "success",
            });
        } catch (error) {   
            toast("Error Logging Out !", {
                autoClose: 2000,
                "type": "error",
            });
        }
    };

    return {
        username, handleLogout, userRole
    }
});
