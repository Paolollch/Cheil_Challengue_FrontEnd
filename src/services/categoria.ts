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

export const categoriaService = {
  getAll: async () => {
    const response = await axiosInstance.get('/categories/getAllCategories');
    return response.data;
  },

  create: async (data: { Name: string; Description: string }) => {
    const response = await axiosInstance.post('/categories/createCategory', data);
    return response.data;
  },

  update: async (id: string, data: { Name: string; Description: string }) => {
    const response = await axiosInstance.put(`/categories/updateCategoryById/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/categories/deleteCategoryById/${id}`);
    return response.data;
  },
};
