// import axios from 'axios'
// import {baseUrl} from './constants'
// const instance=axios.create({
//     baseURL:baseUrl
// })


// instance.interceptors.request.use(
//     config => {
//         // Retrieve the token from local storage
//         const token = localStorage.getItem('token');
//         console.log(token,"the tockedn is taking,value")

//         // If the token exists, add it to the Authorization header
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }

//         return config;
//     },
//     error => {
//         // Handle request errors
//         return Promise.reject(error);
//     }
// );

// export default instance

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
        // Just return the response if it's not a problematic one
        return response;
    },
    error => {
        // Check if the error is because of unauthenticated user
        if (error.response && (error.response.status === 401 || error.response.data.message === 'unauthenticated')) {
            // Logout the user or handle the unauthenticated case
            localStorage.removeItem('token');  // remove token from storage
            // Redirect user to login page or do some other logic
            window.location.href = '/login';  // Adjust this path to your login route

            // Optionally display a message to the user
            // alert('Your session has expired. Please log in again.');
        }

        return Promise.reject(error);
    }
);

export default instance;
