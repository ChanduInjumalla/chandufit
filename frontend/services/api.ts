import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Inject token on every request
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('chandufit_token');
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 globally — redirect to login
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('chandufit_token');
            window.location.href = '/auth/login';
        }
        return Promise.reject(err);
    }
);

export default api;
