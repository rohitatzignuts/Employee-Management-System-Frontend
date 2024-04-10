import axios from "axios";
import CryptoJS from "crypto-js";
import router from '@/router'
import Swal from "sweetalert2";

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
            Swal.fire({
                title: "Logged Out Successfully!",
                icon: "success",
                showConfirmButton: false,
                timer: 500,
            });
        } catch (error) {
            Swal.fire({
                title: `${error}`,
                icon: "error",
                showConfirmButton: false,
                timer: 500,
            });
        }
    };

    return {
        username, handleLogout, userRole
    }
});
