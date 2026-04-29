import axios from 'axios';
import _ from 'lodash';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        const { data } = response;
        return data;
    },
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 và chưa từng retry request này
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    // Gọi API refresh token
                    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/refresh-token`, {
                        refreshToken: refreshToken
                    });

                    if (res.data && res.data.errCode === 0) {
                        const newToken = res.data.accessToken;
                        localStorage.setItem('token', newToken);

                        // Cập nhật token mới vào header của request cũ và thực hiện lại
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        return instance(originalRequest);
                    }
                } catch (refreshError) {
                    console.error("Refresh token failed", refreshError);
                }
            }

            // Nếu không có refreshToken hoặc refresh thất bại -> Logout
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
