/**
 * API utility untuk komunikasi dengan backend menggunakan Axios.
 * @module api
 */
import axios from 'axios';


/**
 * Instance axios yang dikonfigurasi untuk backend.
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    // timeout: 50000  // timeout: 50000  // 5 detik
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


/**
 * Melakukan GET request ke endpoint tertentu.
 * @param {string} endpoint - Path endpoint (misal: '/users')
 * @param {object} [params] - Query parameters opsional
 * @returns {Promise<object>} Response data dari backend
 */
export const getData = async (endpoint, params = {}) => {
    const response = await api.get(endpoint, { params });
    return response.data;
}



/**
 * Melakukan POST request ke endpoint tertentu.
 * @param {string} endpoint - Path endpoint (misal: '/login')
 * @param {object} data - Data yang akan dikirim
 * @returns {Promise<object>} Response data dari backend
 */
export const postData = async (endpoint, data) => {
    const response = await api.post(endpoint, data);
    return response.data;
}


/**
 * Melakukan PUT request ke endpoint tertentu.
 * @param {string} endpoint - Path endpoint (misal: '/users/1')
 * @param {object} data - Data yang akan dikirim
 * @returns {Promise<object>} Response data dari backend
 */
export const putData = async (endpoint, data) => {
    let config = {}
    if (data instanceof FormData) {
        config.headers = { ...api.defaults.headers, 'Content-Type': undefined };
    }
    const response = await api.put(endpoint, data, config);
    return response.data;
}


/**
 * Melakukan DELETE request ke endpoint tertentu.
 * @param {string} endpoint - Path endpoint (misal: '/users/1')
 * @returns {Promise<object>} Response data dari backend
 */
export const deleteData = async (endpoint) => {
    const response = await api.delete(endpoint);
    return response.data;
}



/**
 * Logout the user by removing the token from localStorage.
 */
export function logout() {
  localStorage.removeItem("token");
}