import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const axiosInstance = axios.create({
    baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export const productoService = {

    getAll: async (page: number = 1, limit: number = 10) => {
        const response = await axiosInstance.get(`/products/getAllProducts?page=${page}&limit=${limit}`);
        return response.data;
    },

    create: async (formData: FormData) => {
        const response = await axiosInstance.post('/products/createProduct', formData, {
            headers: { 'Content-Type': 'multipart/form-data', }
        });
        return response.data;
    },

    update: async (formData: FormData, id: number) => {
        const response = await axiosInstance.put(`/products/updateProductById/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data', }
        });
        return response.data;
    },

    delete: async (id: number) => {
        const response = await axiosInstance.delete(`/products/deleteProductById/${id}`);
        return response.data;
    },
};
