import SMSLog from "./SMSLog.model.js";

// Create a new SMS log
export async function createSMSLog(req, res) {
  try {
    const smsLogData = req.body;
    console.log("Received SMS Log Data:", smsLogData); // Log the received data
    const result = await SMSLog.create(smsLogData);
    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating SMS Log:", err.message); // Log any errors that occur
    res.status(500).send({ error: err.message });
  }
}


// Get an SMS log by ID
export async function getSMSLogById(req, res) {
  const id = req.params.id;
  try {
    const result = await SMSLog.findById(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Delete an SMS log by ID
export async function deleteSMSLog(req, res) {
  const id = req.params.id;
  try {
    const result = await SMSLog.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "SMS Log deleted successfully" });
    } else {
      res.status(404).json({ message: "SMS Log not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getLast7SMSLogs(req, res) {
  const mobile = req.params.mobile;
  try {
    const logs = await SMSLog.find({ mobile })
    .limit(7) // limit to the last 7 entries
      .sort({ send_on: -1 }) // sort by send_on ascending to get oldest first
      
      .select("mobile message send_on status"); // select only the required fields

    res.status(200).json(logs);
  } catch (err) {
    console.error("Error fetching SMS logs:", err.message); // Log any errors
    res.status(500).send({ error: err.message });
  }
}

// Get SMS logs filtered by branch with pagination
export async function getSMSLogsByBranch(req, res) {
  const branch = req.params.branch;
  const { item = 10, page = 1 } = req.query; // default to 10 items per page and first page if not provided

  const limit = parseInt(item);
  const skip = (parseInt(page) - 1) * limit;

  try {
    const logs = await SMSLog.find({ branch })
      .sort({ send_on: -1 }) // sort by send_on descending (latest first)
      .skip(skip)
      .limit(limit);

    const totalItems = await SMSLog.countDocuments({ branch });
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