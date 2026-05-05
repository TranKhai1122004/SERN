import axios from 'axios';
import _ from 'lodash';
import reduxStore from './redux';
import actionTypes from './store/actions/actionTypes';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true
});

instance.interceptors.request.use(
    (config) => {
        // Lấy token từ trạng thái hiện tại của Redux Store
        const state = reduxStore.getState();
        const token = state.user.userInfo && state.user.userInfo.token;
        
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

            try {
                console.log("Attempting to refresh token...");
                // Gọi API refresh token (Cookie sẽ tự động được gửi kèm)
                const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/refresh-token`, {}, { withCredentials: true });
                console.log("Refresh response from server:", res.data);

                if (res.data && res.data.errCode === 0) {
                    const newToken = res.data.accessToken;

                    // Cập nhật token mới vào Redux để các request sau sử dụng
                    reduxStore.dispatch({
                        type: actionTypes.UPDATE_ACCESS_TOKEN,
                        token: newToken
                    });

                    // Cập nhật token mới vào header của request cũ và thực hiện lại
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return instance(originalRequest);
                }
            } catch (refreshError) {
                console.error("Refresh token API call failed:", refreshError);
            }

            // Nếu không có refreshToken hoặc refresh thất bại -> Logout
            reduxStore.dispatch({
                type: actionTypes.PROCESS_LOGOUT
            });

            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
