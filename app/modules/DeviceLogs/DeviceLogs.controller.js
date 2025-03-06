import DeviceLogs from "./DeviceLogs.model.js";
import Users from "../Users/Users.model.js";

export async function getDeviceLogsByBranch(req, res) {
  const branch = req.params.branch;
  const { item = 10, page = 1 } = req.query;

  const limit = parseInt(item);
  const skip = (parseInt(page) - 1) * limit;

  try {
    const logs = await DeviceLogs.find({ branchName: branch })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalItems = await DeviceLogs.countDocuments({ branchName: branch });
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      currentPage: parseInt(page),
      data: logs,
      totalItems: totalItems,
      totalPages: totalPages,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function handleDoorAccess(req, res) {
  const { deviceLogId, cardNumber, deviceLogType, logDateTime } = req.body;
  const branchName = req.params.branch;

  try {
    if (deviceLogType === 3) {
      const newLog = new DeviceLogs({
        deviceLogId,
        memberID: null,
        memberName: null,
        memberEmail: null,
        memberPic: null,
        cardNumber: null,
        punchTime: logDateTime ? new Date(logDateTime) : new Date(),
        deviceLogType,
        branchName,
        memberRole: null,
        memberGender: "Other",
      });

      await newLog.save();

      return res
        .status(200)
        .json({ message: "Access Granted via Push Button", log: newLog });
    }

    const user = await Users.findOne({
      card_no: cardNumber,
      branch: branchName,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const currentDate = new Date();
    const expireDate = new Date(user.expiredate);

    if (currentDate > expireDate) {
      return res
        .status(403)
        .json({ message: "Access Denied: Membership expired." });
    }

    const welcomeUser = {
      deviceLogId,
      memberID: user.member_id,
      memberName: user.full_name,
      memberEmail: user.email,
      memberPic: user.photourl,
      cardNumber,
      punchTime: logDateTime ? new Date(logDateTime) : new Date(),
      deviceLogType,
      branchName,
      memberRole: user.role,
      memberGender: user.gender,
    };

    const newLog = new DeviceLogs(welcomeUser);

    await newLog.save();

    // Access granted for card access
    res.status(200).json({ message: "Access Granted", log: newLog });

    global.io.emit("visitor-data", welcomeUser);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
// export async function getFilteredMonthlyDeviceLogs(req, res) {
//   const { year, month, user, gender } = req.params;

//   let memberRoleFilter = {};
//   let memberGenderFilter = {};
//   let dateFilter = {};

//   // Determine the member role filter
//   if (user === "ALL") {
//     memberRoleFilter = {}; // No filtering by role
//   } else if (user === "MEMBER") {
//     memberRoleFilter = { memberRole: "member" };
//   } else if (user === "STAFF") {
//     memberRoleFilter = { memberRole: { $ne: "member" } };
//   }

//   if (gender !== "ALL") {
//     memberGenderFilter = { memberGender: gender };
//   }

//   if (year && month) {
//     const startDate = new Date(year, month - 1, 1); // month is 0-indexed in JS Date
//     const endDate = new Date(year, month, 0); // last day of the month

//     dateFilter = { punchTime: { $gte: startDate, $lte: endDate } };
//   }

//   try {
//     const logs = await DeviceLogs.find({
//       ...memberRoleFilter,
//       ...memberGenderFilter,
//       ...dateFilter,
//     }).sort({ punchTime: 1 });

//     const groupedLogs = logs.reduce((acc, log) => {
//       const key = log.memberID ? `${log.memberID}` : `${log.memberEmail}`;
//       if (!acc[key]) {
//         acc[key] = {
//           branchName: log.branchName,
//           memberRole: log.memberRole,
//           memberName: log.memberName,
//           memberID: log.memberID,
//           punch: [],
//         };
//       }

//       const logDate = log.punchTime.toISOString().split("T")[0]; // Extract the date part (YYYY-MM-DD)
//       const existingLogForDate = acc[key].punch.find((p) => p.Date === logDate);

//       if (existingLogForDate) {
//         if (log.deviceLogType === 2) {
//           existingLogForDate.punchOutTime = log.punchTime;
//         }
//       } else {
//         acc[key].punch.push({
//           Date: logDate,
//           punchinTime: log.deviceLogType === 1 ? log.punchTime : null,
//           punchOutTime: log.deviceLogType === 2 ? log.punchTime : null,
//         });
//       }

//       return acc;
//     }, {});

//     // Convert grouped logs to an array and filter out entries with missing memberName or memberID
//     const filteredLogs = Object.values(groupedLogs)
//       .map((log) => {
//         if (!log.memberName || !log.memberID) {
//           return null; // Skip logs with missing memberName or memberID
//         }

//         return {
//           branchName: log.branchName || undefined,
//           memberRole: log.memberRole || undefined,
//           memberName: log.memberName || undefined,
//           memberID: log.memberID || undefined,
//           punch: log.punch.map((punch) => ({
//             Date: punch.Date,
//             punchinTime: punch.punchinTime || undefined,
//             punchOutTime: punch.punchOutTime || undefined,
//           })),
//         };
//       })
//       .filter(
//         (log) =>
//           log !== null &&
//           (log.branchName ||
//             log.memberRole ||
//             log.memberName ||
//             log.memberID ||
//             log.punch.some((p) => p.punchinTime || p.punchOutTime))
//       );

//     res.status(200).json(filteredLogs);
//   } catch (err) {
//     res.status(500).send({ error: err.message });
//   }
// }
export async function getFilteredMonthlyDeviceLogs(req, res) {
  const { year, month, user, gender, branch } = req.params;

  let memberRoleFilter = {};
  let memberGenderFilter = {};
  let dateFilter = {};
  let branchFilter = {};

  // Determine the member role filter
  if (user === "ALL") {
    memberRoleFilter = {}; // No filtering by role
  } else if (user === "MEMBER") {
    memberRoleFilter = { memberRole: "member" };
  } else if (user === "STAFF") {
    memberRoleFilter = { memberRole: { $ne: "member" } };
  }

  // Determine the gender filter
  if (gender !== "ALL") {
    memberGenderFilter = { memberGender: gender };
  }

  // Determine the date filter for the month
  if (year && month) {
    const startDate = new Date(year, month - 1, 1); // month is 0-indexed in JS Date
    const endDate = new Date(year, month, 0); // last day of the month
    dateFilter = { punchTime: { $gte: startDate, $lte: endDate } };
  }

  // Determine the branch filter
  if (branch !== "ALL") {
    branchFilter = { branchName: branch };
  }

  try {
    const logs = await DeviceLogs.find({
      ...memberRoleFilter,
      ...memberGenderFilter,
      ...dateFilter,
      ...branchFilter,
    }).sort({ punchTime: 1 });

    const groupedLogs = logs.reduce((acc, log) => {
      const key = log.memberID ? `${log.memberID}` : `${log.memberEmail}`;
      if (!acc[key]) {
        acc[key] = {
          branchName: log.branchName,
          memberRole: log.memberRole,
          memberName: log.memberName,
          memberID: log.memberID,
          punch: [],
        };
      }

      const logDate = log.punchTime.toISOString().split("T")[0]; // Extract the date part (YYYY-MM-DD)
      const existingLogForDate = acc[key].punch.find((p) => p.Date === logDate);

      if (existingLogForDate) {
        if (log.deviceLogType === 2) {
          existingLogForDate.punchOutTime = log.punchTime;
        }
      } else {
        acc[key].punch.push({
          Date: logDate,
          punchinTime: log.deviceLogType === 1 ? log.punchTime : null,
          punchOutTime: log.deviceLogType === 2 ? log.punchTime : null,
        });
      }

      return acc;
    }, {});

    // Convert grouped logs to an array and filter out entries with missing memberName or memberID
    const filteredLogs = Object.values(groupedLogs)
      .map((log) => {
        if (!log.memberName || !log.memberID) {
          return null; // Skip logs with missing memberName or memberID
        }

        return {
          branchName: log.branchName || undefined,
          memberRole: log.memberRole || undefined,
          memberName: log.memberName || undefined,
          memberID: log.memberID || undefined,
          punch: log.punch.map((punch) => ({
            Date: punch.Date,
            punchinTime: punch.punchinTime || undefined,
            punchOutTime: punch.punchOutTime || undefined,
          })),
        };
      })
      .filter(
        (log) =>
          log !== null &&
          (log.branchName ||
            log.memberRole ||
            log.memberName ||
            log.memberID ||
            log.punch.some((p) => p.punchinTime || p.punchOutTime))
      );

    res.status(200).json(filteredLogs);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}


// export async function getFilteredDeviceLogs(req, res) {
//   const { user, date, gender } = req.params;

//   let memberRoleFilter = {};
//   let memberGenderFilter = {};
//   let dateFilter = {};

//   // Determine the member role filter
//   if (user === "ALL") {
//     memberRoleFilter = {}; // No filtering by role
//   } else if (user === "MEMBER") {
//     memberRoleFilter = { memberRole: "member" };
//   } else if (user === "STAFF") {
//     memberRoleFilter = { memberRole: { $ne: "member" } };
//   }

//   if (gender !== "ALL") {
//     memberGenderFilter = { memberGender: gender };
//   }

//   if (date) {
//     const startDate = new Date(date);
//     const endDate = new Date(date);
//     endDate.setHours(23, 59, 59, 999);

//     dateFilter = { punchTime: { $gte: startDate, $lte: endDate } };
//   }

//   try {
//     const logs = await DeviceLogs.find({
//       ...memberRoleFilter,
//       ...memberGenderFilter,
//       ...dateFilter,
//     }).sort({ punchTime: 1 });

//     const filteredLogs = [];

//     const groupedLogs = logs.reduce((acc, log) => {
//       const key = log.memberID ? `${log.memberID}` : `${log.memberEmail}`;
//       if (!acc[key]) {
//         acc[key] = [];
//       }
//       acc[key].push(log);
//       return acc;
//     }, {});

//     for (const key in groupedLogs) {
//       const logsForUser = groupedLogs[key];

//       const firstPunchIn = logsForUser.find((log) => log.deviceLogType === 1);
//       const lastPunchOut = logsForUser
//         .reverse()
//         .find((log) => log.deviceLogType === 2);

//       if (firstPunchIn || lastPunchOut) {
//         filteredLogs.push({
//           branchName: firstPunchIn
//             ? firstPunchIn.branchName
//             : lastPunchOut.branchName,
//           memberRole: firstPunchIn
//             ? firstPunchIn.memberRole
//             : lastPunchOut.memberRole,
//           memberName: firstPunchIn
//             ? firstPunchIn.memberName
//             : lastPunchOut.memberName,
//           memberID: firstPunchIn
//             ? firstPunchIn.memberID
//             : lastPunchOut.memberID,
//           punchinTime: firstPunchIn ? firstPunchIn.punchTime : null,
//           punchOutTime: lastPunchOut ? lastPunchOut.punchTime : null,
//         });
//       }
//     }

//     res.status(200).json(filteredLogs);
//   } catch (err) {
//     res.status(500).send({ error: err.message });
//   }
// }

export async function getFilteredDeviceLogs(req, res) {
  const { user, date, gender, branch } = req.params;

  let memberRoleFilter = {};
  let memberGenderFilter = {};
  let dateFilter = {};
  let branchFilter = {};

  // Determine the member role filter
  if (user === "ALL") {
    memberRoleFilter = {}; // No filtering by role
  } else if (user === "MEMBER") {
    memberRoleFilter = { memberRole: "member" };
  } else if (user === "STAFF") {
    memberRoleFilter = { memberRole: { $ne: "member" } };
  }

  // Determine the gender filter
  if (gender !== "ALL") {
    memberGenderFilter = { memberGender: gender };
  }

  // Determine the date filter
  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    dateFilter = { punchTime: { $gte: startDate, $lte: endDate } };
  }

  // Determine the branch filter
  if (branch !== "ALL") {
    branchFilter = { branchName: branch };
  }

  try {
    const logs = await DeviceLogs.find({
      ...memberRoleFilter,
      ...memberGenderFilter,
      ...dateFilter,
      ...branchFilter,
    }).sort({ punchTime: 1 });

    const filteredLogs = [];

    const groupedLogs = logs.reduce((acc, log) => {
      const key = log.memberID ? `${log.memberID}` : `${log.memberEmail}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(log);
      return acc;
    }, {});

    for (const key in groupedLogs) {
      const logsForUser = groupedLogs[key];

      const firstPunchIn = logsForUser.find((log) => log.deviceLogType === 1);
      const lastPunchOut = logsForUser
        .reverse()
        .find((log) => log.deviceLogType === 2);

      if (firstPunchIn || lastPunchOut) {
        filteredLogs.push({
          branchName: firstPunchIn
            ? firstPunchIn.branchName
            : lastPunchOut.branchName,
          memberRole: firstPunchIn
            ? firstPunchIn.memberRole
            : lastPunchOut.memberRole,
          memberName: firstPunchIn
            ? firstPunchIn.memberName
            : lastPunchOut.memberName,
          memberID: firstPunchIn
            ? firstPunchIn.memberID
            : lastPunchOut.memberID,
          punchinTime: firstPunchIn ? firstPunchIn.punchTime : null,
          punchOutTime: lastPunchOut ? lastPunchOut.punchTime : null,
        });
      }
    }

    res.status(200).json(filteredLogs);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}


export async function getLatestDeviceLogsByBranch(req, res) {
  const branch = req.params.branch;

  try {
    const logs = await DeviceLogs.find({ branchName: branch })
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json(logs);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
