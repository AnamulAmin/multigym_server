import { Router } from "express";
import {
  getDeviceLogsByBranch,
  getLatestDeviceLogsByBranch,
  handleDoorAccess,
  getFilteredDeviceLogs,
  getFilteredMonthlyDeviceLogs,
} from "./DeviceLogs.controller.js";

const DeviceLogsRoutes = Router();

// Route to get device logs by branch
DeviceLogsRoutes.get("/branch/:branch", getDeviceLogsByBranch);

// Route to get the latest device logs by branch
DeviceLogsRoutes.get("/:branch/latest", getLatestDeviceLogsByBranch);

// Route to handle door access
DeviceLogsRoutes.post("/branch/:branch/access", handleDoorAccess);

// Route to get filtered device logs by user, date, and gender (daily)
DeviceLogsRoutes.get("/filter/:user/:date/:gender/:branch", getFilteredDeviceLogs);

// Route to get filtered device logs by year, month, user, and gender (monthly)
DeviceLogsRoutes.get("/filter/:year/:month/:user/:gender/:branch", getFilteredMonthlyDeviceLogs);

export default DeviceLogsRoutes;