import { Router } from "express";
import DeviceLogsRoutes from "../app/modules/DeviceLogs/DeviceLogs.routes.js";
import usersRoutes from "../app/modules/Users/User.routes.js";
import DepartmentsRoutes from "../app/modules/Departments/Departments.routes.js";
import PackagesRoutes from "../app/modules/Package/Package.routes.js";
import ClassesRoutes from "../app/modules/Classes/Classes.routes.js";
import GymMachinesRoutes from "../app/modules/Workout_Machine/GymMachines.routes.js";
import WorkoutRoutes from "../app/modules/Workout/Workout.routes.js";
import SmsTemplatesRoutes from "../app/modules/SmsTemplates/SmsTemplates.routes.js";
import SMSGroupsRoutes from "../app/modules/SMSGroups/SMSGroups.routes.js";
import SMSLogRoutes from "../app/modules/SMSLog/SMSLog.routes.js";
import { sendSimpleSms } from "../app/modules/SMS/sendSimpleSms.controller.js";
import InvoicesRoutes from "../app/modules/Invoice/Invoice.routes.js";
import WelcomeUserRoutes from "../app/modules/WellComeUsers/WelComeUser.routes.js";
import dietPlanRoutes from "../app/modules/DietPlan/DietPlan.routes.js";
import TransactionRoutes from "../app/modules/Transaction/Transaction.routes.js";
import SMSIDRoutes from "../app/modules/SmsID/SenderID.routes.js";
import { getImageUrl } from "../config/space.js";
import BranchRoutes from "../app/modules/Branch/Branch.routes.js";
import SMSCampaignRoutes from "../app/modules/SMSCampaign/SMSCampaign.routes.js";
import permissionRoutes from "../app/modules/Permission/permission.routes.js";
import WorkoutRoutineRoutes from "../app/modules/Workout_rutine/WorkoutRoutine.routes.js";
import LockerRoutes from "../app/modules/Locker/Locker.routes.js";
import PaymentMethodRouter from "../app/modules/PaymentMethod/PaymentMethod.routes.js";
import TransactionTypeRouter from "../app/modules/AddTransactionType/AddTransactionType.routes.js";
import DeviceInfoRoutes from "../app/modules/DeviceInfo/DeviceInfo.routes.js";
import emailRoutes from "../app/modules/Emails/Email.routes.js";
import followupRoutes from "../app/modules/Flowup/followup.routes.js";
import deviceInfoRoutes from "../app/modules/DeviceInfo/DeviceInfo.routes.js";

const routes = Router();
routes.use("/branches", BranchRoutes);
routes.use("/users", usersRoutes);
routes.use("/departments", DepartmentsRoutes);
routes.use("/package", PackagesRoutes);
routes.use("/device-logs", DeviceLogsRoutes);
routes.use("/invoice", InvoicesRoutes);
routes.use("/transaction", TransactionRoutes);
routes.use("/transaction-type", TransactionTypeRouter);
routes.use("/visitor", WelcomeUserRoutes);
routes.use("/classes", ClassesRoutes);

routes.use("/gym-machines", GymMachinesRoutes);
routes.use("/workouts", WorkoutRoutes);
routes.use("/workout-routines", WorkoutRoutineRoutes);

routes.use("/smstemplates", SmsTemplatesRoutes);
routes.use("/smsgroups", SMSGroupsRoutes);
routes.use("/smslogs", SMSLogRoutes); ///branch/shia?item=15&page=1
routes.post("/send-sms", sendSimpleSms);
routes.use("/senderids", SMSIDRoutes);
routes.use("/smscampaigns", SMSCampaignRoutes);

routes.use("/lockers", LockerRoutes);

routes.use("/diet-plan", dietPlanRoutes);
routes.use("/followup", followupRoutes);

// routes.use("/user_diet_plan", userDietPlanRoutes);


// routes.use("/user_diet_plan", userDietPlanRoutes);

routes.use("/device-logs", DeviceLogsRoutes);

routes.use("/device-info", deviceInfoRoutes);

routes.use("/permissions", permissionRoutes);

routes.use("/payment-method", PaymentMethodRouter);

routes.post("/get-image-url", getImageUrl);

routes.use("/email",emailRoutes);

export default routes;
