import axios from "axios";
import store from "../redux/store"; 

const axiosJWT = axios.create();

axiosJWT.interceptors.request.use(
    async (config) => {
        const state = store.getState();
        const token = state.auth.login.currentUser?.access_token;

        if (token) {
            config.headers["token"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosJWT;

