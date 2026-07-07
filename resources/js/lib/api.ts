import axios from 'axios';

export const api = axios.create({
    baseURL: '',
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
    withXSRFToken: true,
});

export default api;
