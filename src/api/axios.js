

import axios from 'axios';
import { baseUrl } from './constants';

const instance = axios.create({
    baseURL: baseUrl
});

instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response && (error.response.status === 401 || error.response.data.message === 'unauthenticated' || error.response.error == 'Unauthorized')) {
            alert("unauthorised")
            localStorage.removeItem('token');  // remove token from storage
            window.location.href = '/login';  // Adjust this path to your login route
        }

        return Promise.reject(error);
    }
);

export default instance;
