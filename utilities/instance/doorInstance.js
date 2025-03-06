import axios from 'axios';
import { getToken } from '../../config/Service/deviceAuthService.js';
import { deviceBaseUrl } from '../../config/deviceConfig.js';

const doorInstance = axios.create({
    baseURL: deviceBaseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

doorInstance.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        
        if (!token) {
            console.error('No token available');
            throw new Error('Authentication token missing');
        }

        config.headers['token'] = token;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default doorInstance;
