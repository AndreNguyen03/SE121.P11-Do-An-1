import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3056/api', // Đổi thành URL backend của bạn
    headers: {
        'Content-Type': 'application/json',
    },
    
});

export default axiosInstance;
