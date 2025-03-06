import { Router } from "express";
import { addDepartment, addPersonnel, addVisitorInfo, getAccessRecords, queryDepartmentTree, queryEmployeeInfo, selectBindPersonBySn, selectGateEquipBySn, selectNotOccupyCard, verifyUser } from './DeviceInfo.controller.js';


const deviceInfoRoutes = Router();

deviceInfoRoutes.get("/",verifyUser);
deviceInfoRoutes.get("/employee-info",queryEmployeeInfo);
deviceInfoRoutes.get("/access-records",getAccessRecords);
deviceInfoRoutes.get("/department-tree",queryDepartmentTree);
deviceInfoRoutes.post("/add-person",addPersonnel);
deviceInfoRoutes.post("/add-department",addDepartment);
deviceInfoRoutes.post("/add-card-info",selectNotOccupyCard);
deviceInfoRoutes.post("/get-equipment-by-sn",selectGateEquipBySn);
deviceInfoRoutes.post("/bind-person-by-sn",selectBindPersonBySn);
deviceInfoRoutes.post("/add-visitor",addVisitorInfo);

export default deviceInfoRoutes;
