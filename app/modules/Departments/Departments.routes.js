import { Router } from "express";
import {
  createDepartment,
  getAllDepartment,
  getAllDepartments,
  getByIdDepartment,
  removeDepartment,
  updateDepartment,
} from "./Departments.controller.js";

const DepartmentsRoutes = Router();

DepartmentsRoutes.get("/", getAllDepartments);
DepartmentsRoutes.get("/:branch/get-all", getAllDepartment);

DepartmentsRoutes.get("/get-id/:id", getByIdDepartment);

DepartmentsRoutes.post("/post", createDepartment);

DepartmentsRoutes.delete("/delete/:id", removeDepartment);

DepartmentsRoutes.put("/put/:id", updateDepartment);

export default DepartmentsRoutes;
