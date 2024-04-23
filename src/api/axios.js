import axios from 'axios'
import {baseUrl} from './constants'
const instance=axios.create({
    baseURL:baseUrl
})


instance.interceptors.request.use(
    config => {
        // Retrieve the token from local storage
        const token = localStorage.getItem('token');
        console.log(token,"the tockedn is taking,value")

        // If the token exists, add it to the Authorization header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    error => {
        // Handle request errors
        return Promise.reject(error);
    }
);

export default instance