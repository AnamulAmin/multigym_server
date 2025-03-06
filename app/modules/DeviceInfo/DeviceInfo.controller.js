import axios from "axios";
import { deviceBaseUrl } from "../../../config/deviceConfig.js";
import { getToken } from "../../../config/Service/deviceAuthService.js";
import doorInstance from "../../../utilities/instance/doorInstance.js";
import FormData from 'form-data';
import fs from 'fs';

// Device data
const defaultDeviceInfo = {
    name: "testdev5",
    mac: "301F9A844F5B",
    company: "MULTIGYMPREMIUM-SHIA MOSJID BRANCH",
    department: "Unallocation department",
    version: "rk3288_7.1.2_20200917.111528(V3.3.7.3_88)",
};
// Login
export async function verifyUser(req, res) {
    try {
        const { deptId, sn, pageNum } = req.query;

        const url = `/cloudIntercom/selectGateEquipByQueryVo`;

        const response = await doorInstance.get(url, {
            params: {
                deptId,
                sn,
                pageNum
            }
        });

        console.log(getToken())
        if (!response.data || !response.data.data || !response.data.data.list || response.data.data.list.length === 0) {
            return res.status(404).json({ message: 'Device not found' });
        }


        const device = response.data.data.list[0];


        const formattedData = {
            id: device.id,
            deptId: device.deptId,
            deptName: device.deptName,
            password: "00000",
            status: device.onlineStatus === "1" ? '1' : '0',
            sn: device.sn || defaultDeviceInfo.mac,
            softVersion: device.softVersion || defaultDeviceInfo.version,
            equipName: device.equipName || defaultDeviceInfo.name,
        };

        res.status(200).json(response.data);
        // console.log(response.data);
        console.log(formattedData);
    } catch (error) {
        console.error('Error fetching device information:', error);
        res.status(500).json({ message: 'Error fetching device information' });
    }
};
export async function queryEmployeeInfo(req, res) {
    try {
        const { deptId, pageNum, pageSize } = req.query;

        // validating while query is from frontend

        // if (!pageNum || !pageSize) {
        //     return res.status(400).json({ message: 'pageNum and pageSize are required.' });
        // }

        const response = await doorInstance.get('/cloudIntercom/selectPersonByQueryVo', {
            params: {
                deptId: "12844a1b66214edbb6ed5231d5abe37e",
                pageNum: 1,
                pageSize: 10,
            }
        });

        if (response.data.code !== 0) {
            return res.status(400).json({ message: 'Query failed', error: response.data.message });
        }

        // const employeeData = response.data.data.map(employee => ({
        //     id: employee.id,
        //     name: employee.name,
        //     sex: employee.sex,
        //     birth: employee.birth,
        //     idCard: employee.idCard,
        //     phone: employee.phone,
        //     emerPer: employee.emerPer,
        //     emerPhone: employee.emerPhone,
        //     photoUrl: employee.photoUrl,
        //     cardNum: employee.cardNum,
        //     cardId: employee.cardId,
        //     status: employee.status,
        //     onlineState: employee.onlineState,
        //     deptId: employee.deptId,
        //     deptName: employee.deptName,
        //     job: employee.job || null
        // }));

        return res.status(200).json({
            // message: response.data.msg,
            // size: response.data.size,
            // pages: response.data.pages,
            // employees: employeeData,
            res: response.data
        });

    } catch (error) {
        console.error('Error querying employee information:', error);
        res.status(500).json({ message: 'Error querying employee information' });
    }
}
// Get records 
export async function getAccessRecords(req, res) {
    try {
        const { startTime, endTime, arType, passType, pageNum, pageSize, eqId, deptId } = req.query;

        const url = '/cloudIntercom/selectAccessRecord';

        const response = await doorInstance.get(url, {
            params: {
                startTime,
                endTime,
                arType,
                passType,
                pageNum,
                pageSize,
                eqId,
                deptId
            }
        });

        if (!response.data || response.data.code !== 0) {
            return res.status(404).json({ message: 'No access records found' });
        }

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching access records:', error);
        res.status(500).json({ message: 'Error fetching access records' });
    }
};
// Department tree 
export async function queryDepartmentTree(req, res) {
    try {

        const url = '/cloudIntercom/selectDepartmentTree';
        const response = await doorInstance.get(url);

        if (!response.data || response.data.code !== 0) {
            return res.status(404).json({ message: 'Failed to retrieve department tree' });
        }

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching department tree:', error);
        res.status(500).json({ message: 'Error fetching department tree' });
    }
};
// export async function addPersonnel(req, res) {
//     try {

//         const { deptId, cardId, name, sex, birth, idCard, phone, emerPer, emerPhone, job } = req.body;

//         if (!deptId || !name || !phone) {
//             return res.status(400).json({ message: 'deptId, name, and phone are required fields.' });
//         }

//         const requestBody = {
//             deptId,
//             cardId,
//             name: name.trim(),
//             sex,
//             birth,
//             idCard,
//             phone,
//             emerPer,
//             emerPhone,
//             job,
//         };

//         // const requestBody = {
//         //     "deptId": "12844a1b66214edbb6ed5231d5abe37e",
//         //     "name": "John Doe",
//         //     "phone": "1234567890",

//         // };

//         const response = await doorInstance.post('/cloudIntercom/insertPerson', requestBody);

//         if (response.data.code !== 0) {
//             console.log(response.data)
//             return res.status(400).json({ message: 'Error saving personnel', error: response.data.msg });
//         }


//         return res.status(200).json({
//             message: response.data.msg || 'Personnel added successfully!',
//             data: response.data.data
//         });

//     } catch (error) {
//         console.error('Error adding personnel:', error);
//         res.status(500).json({ message: 'Error adding personnel' });
//     }
// }

export async function addPersonnel(req, res) {
    try {
        const { deptId, cardId, name, sex, birth, idCard, phone, emerPer, emerPhone, job } = req.body;

        if (!deptId || !name || !phone) {
            return res.status(400).json({ message: 'deptId, name, and phone are required fields.' });
        }

        const requestBody = {
            deptId,
            cardId,
            name: name,
            sex,
            birth,
            idCard,
            phone,
            emerPer,
            emerPhone,
            job,
        };

        // Log request body
        console.log("Request body:", requestBody);

        // Get the token
        const token = await getToken();

        if (!token) {
            return res.status(500).json({ message: 'Failed to retrieve authentication token.' });
        }

        // Log token
        console.log("Token:", token);

        // Make the POST request directly
        const response = await axios.post(
            `${deviceBaseUrl}/cloudIntercom/insertPerson`,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                }
            }
        );

        // Log API response
        console.log("API Response:", response.data);

        if (response.data.code !== 0) {
            return res.status(400).json({ message: 'Error saving personnel', error: response.data.msg });
        }

        return res.status(200).json({
            message: response.data.msg || 'Personnel added successfully!',
            data: response.data.data
        });

    } catch (error) {
        console.error('Error adding personnel:', error);
        res.status(500).json({ message: 'Error adding personnel' });
    }
}

export async function addDepartment(req, res) {
    try {
        const { deptName, dataType, address, parentId } = req.body;

        // Validate required fields
        // if (!deptName || !dataType || !parentId) {
        //     return res.status(400).json({
        //         message: 'deptName, dataType, and parentId are required fields.'
        //     });
        // }

        // Prepare request body
        const requestBody = {
            "deptName": "12",
            "dataType": "1",
            "parentId": "-1"
        };

        // Send POST request
        const response = await doorInstance.post('/cloudIntercom/insertDepartment', requestBody);

        // Check the response code from the API
        console.log(response.data)
        if (response.data.code !== 0) {
            return res.status(400).json({
                message: 'Error adding department',
                error: response.data.msg
            });
        }

        // Success response
        return res.status(200).json({
            message: response.data.msg || 'Department added successfully!',
            data: response.data.data
        });

    } catch (error) {
        console.error('Error adding department:', error);
        res.status(500).json({ message: 'Error adding department' });
    }
}

export async function selectNotOccupyCard(req, res) {
    try {
        const { cardNum } = req.body;

        // Validate required parameter
        if (!cardNum) {
            return res.status(400).json({
                message: 'cardNum is a required field.'
            });
        }

        // Prepare request body
        const requestBody = { cardNum };

        // Send POST request to select card
        const response = await doorInstance.post('/cloudIntercom/selectNotOccupyCard', requestBody);

        // Check the response code from the API
        if (response.data.code !== 0) {
            return res.status(400).json({
                message: 'Error selecting card',
                error: response.data.msg
            });
        }

        // Success response
        console.log(response.data)
        return res.status(200).json({
            message: response.data.msg || 'Card selected successfully!',
            data: response.data.data
        });

    } catch (error) {
        console.error('Error selecting card:', error);
        res.status(500).json({ message: 'Error selecting card' });
    }
}


export async function selectGateEquipBySn(req, res) {
    try {
        const { sn } = req.body;

        // Validate required parameter
        if (!sn) {
            return res.status(400).json({
                message: 'sn (equipment number) is a required field.'
            });
        }

        // Prepare request body
        const requestBody = { sn };

        // Send POST request using doorInstance
        const response = await doorInstance.post('/cloudIntercom/api/selectGateEquipBySn', requestBody);

        // Check the response code from the API
        if (response.data.code !== 0) {
            return res.status(400).json({
                message: 'Error querying equipment information',
                error: response.data.msg
            });
        }

        // Success response
        return res.status(200).json({
            message: response.data.msg || 'Equipment information retrieved successfully!',
            data: response.data.data
        });

    } catch (error) {
        console.error('Error querying equipment information:', error);
        res.status(500).json({ message: 'Error querying equipment information' });
    }
}

export async function selectBindPersonBySn(req, res) {
    try {
        const { sn } = req.body;

        // Validate required parameter
        if (!sn) {
            return res.status(400).json({
                message: 'sn (equipment number) is a required field.'
            });
        }

        // Prepare request body
        const requestBody = { sn };

        // Send POST request using doorInstance
        const response = await doorInstance.post('/cloudIntercom/api/selectBindPersonBySn', requestBody);

        // Check the response code from the API
        console.log(response.data)
        if (response.data.code !== 0) {
            return res.status(400).json({
                message: 'Error querying personnel information',
                error: response.data.msg
            });
        }

        // Success response
        return res.status(200).json({
            message: response.data.msg || 'Personnel information retrieved successfully!',
            data: response.data.data
        });

    } catch (error) {
        console.error('Error querying personnel information:', error);
        res.status(500).json({ message: 'Error querying personnel information' });
    }
}

export async function addVisitorInfo(req, res) {
    try {
        const { mac, name, phone, sex } = req.body;
        const { files } = req; // Assuming `files` is provided in req.files (e.g., using multer for file uploads)

        // Validate required parameters
        if (!mac || !name || !phone || !sex || !files) {
            return res.status(400).json({
                message: 'mac, name, phone, sex, and files are required fields.'
            });
        }

        // Prepare form data for the request
        const formData = new FormData();
        formData.append('mac', mac);
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('sex', sex);
        
        // Add each file to the form data
        files.forEach(file => {
            formData.append('files', fs.createReadStream(file.path)); // Assuming file path is provided by multer
        });

        // Send POST request with form data
        const response = await doorInstance.post('/cloudIntercom/api/addVisitorInfo', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        // Check the response code from the API
        if (response.data.code !== 0) {
            return res.status(400).json({
                message: 'Error adding visitor information',
                error: response.data.msg
            });
        }

        // Success response
        return res.status(200).json({
            message: response.data.msg || 'Visitor information saved successfully!',
            data: response.data.data
        });

    } catch (error) {
        console.error('Error adding visitor information:', error);
        res.status(500).json({ message: 'Error adding visitor information' });
    }
}