import { Router } from "express";
import { createClass, getAllClasses,getAllClass, getByIdClass, removeClass, updateClass, registerClass, updateAttendence } from "./Classes.controller.js";

const classesRoutes = Router();

classesRoutes.get("/",getAllClasses);
classesRoutes.get("/:branch/get-all",getAllClass);
classesRoutes.get("/get-id/:id",getByIdClass);

classesRoutes.post("/post",createClass);

classesRoutes.put("/put/:id",updateClass);

classesRoutes.delete("/delete/:id",removeClass);

classesRoutes.post("/register/:classId",registerClass);

classesRoutes.put("/:classId/attendance" , updateAttendence);
export default classesRoutes;
