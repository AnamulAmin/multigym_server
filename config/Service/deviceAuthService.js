import axios from 'axios';
import 'dotenv/config';
import qs from 'qs';

let deviceToken = null;

const credentials = {
    userName: process.env.DEVICE_USERNAME || 'admin',
    password: process.env.DEVICE_PASSWORD || 'admin',
};

const deviceBaseUrl = `http://${process.env.DEVICE_API_IP}:${process.env.DEVICE_API_PORT}`;

const loginDevice = async () => {
    try {
        const response = await axios.post(`${deviceBaseUrl}/cloudIntercom/login`, 
            qs.stringify(credentials), 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', 
                },
            }
        );

        if (response.data.code === 0) {
            console.log('Door device login successful');

            deviceToken = response.data.token;
        
            return deviceToken;
        } else {
            console.error('Login failed:', response.data.message);
            return null;
        }
    } catch (error) {
        console.error('Error logging in:', error);
        return null;
    }
};


export const getToken = async () => {

    if (!deviceToken) {
        await loginDevice();
    }
    return deviceToken;
};


export const retryRequestWithLogin = async (axiosConfig) => {
    try {
 
        const response = await axios(axiosConfig);
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('Token expired, attempting re-login...');

 
            await loginDevice();


            const token = await getToken();
            if (!token) {
                throw new Error('Unable to re-login and fetch a new token');
            }

  
            axiosConfig.headers['Authorization'] = `Bearer ${token}`;
            return axios(axiosConfig);
        } else {
            throw error;
        }
    }
};
