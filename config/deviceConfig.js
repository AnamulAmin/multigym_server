// config/deviceConfig.js
import 'dotenv/config';

const deviceBaseUrl = `http://${process.env.DEVICE_API_IP}:${process.env.DEVICE_API_PORT}`;
console.log(deviceBaseUrl);

export { deviceBaseUrl };
