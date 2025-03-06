import FollowUp from "./followup.model.js";
import Users from "./../Users/Users.model.js";

export async function createOrUpdateFollowUp(req, res) {
  try {
    const { userId, followUp, nextFollowUpDate, status, branch } = req.body;

    // Check if all required fields are provided
    if (
      !userId ||
      !nextFollowUpDate ||
      !status ||
      !followUp ||
      !Array.isArray(followUp) ||
      !followUp[0].date ||
      !followUp[0].description
    ) {
      return res.status(400).json({
        error: "Invalid data format. Ensure `userId`, `nextFollowUpDate`, `status`, and `followUp` (with `date` and `description`) are provided.",
      });
    }

    // Check if a follow-up already exists for the user
    const existingFollowUp = await FollowUp.findOne({ userId });

    if (existingFollowUp) {
      // If a follow-up exists, add new entry to the followUp array
      existingFollowUp.followUp.push({
        date: followUp[0].date,
        description: followUp[0].description,
      });
      existingFollowUp.nextFollowUpDate = nextFollowUpDate;
      existingFollowUp.status = status;
      if (branch) existingFollowUp.branch = branch;

      await existingFollowUp.save();

      res.status(200).json({
        message: "Follow-up updated successfully",
        updatedFollowUp: existingFollowUp,
      });
    } else {
      // Create a new follow-up if none exists
      const newFollowUp = await FollowUp.create({
        userId,
        followUp: [
          {
            date: followUp[0].date,
            description: followUp[0].description,
          },
        ],
        nextFollowUpDate,
        status,
        branch,
      });

      res.status(201).json({
        message: "Follow-up created successfully",
        newFollowUp,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getTodayFollowUps(req, res) {
  try {
    // Get the start of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Set to midnight of today

    // Get the start of tomorrow to define the end of today
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(startOfToday.getDate() + 1); // Start of the next day

    const result = await FollowUp.find({
      nextFollowUpDate: {
        $gte: startOfToday,
        $lt: endOfToday,
      },
    }).populate("userId", "full_name email contact_no member_id nickname date_of_birth");

    res.json(result);
  } catch (err) {
    console.error("Error fetching today's follow-ups:", err);
    res.status(500).send({ error: err.message });
  }
}
// Get all follow-up records
export async function getAllFollowUps(req, res) {
  try {
    const result = await FollowUp.find().populate("userId", "full_name email contact_no");
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Get follow-up records by user ID
export async function getFollowUpsByUserId(req, res) {
  const { userId } = req.params;
  try {
    const result = await FollowUp.find({ userId }).populate("userId", "full_name email contact_no");
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Get a specific follow-up record by its ID
export async function getFollowUpById(req, res) {
  const { id } = req.params;
  try {
    const result = await FollowUp.findById(id).populate("userId", "full_name email contact_no");
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Update a follow-up record
export async function updateFollowUp(req, res) {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const result = await FollowUp.findByIdAndUpdate(id, updatedData, { new: true }).populate(
      "userId",
      "full_name email contact_no"
    );
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Delete a follow-up record
export async function deleteFollowUp(req, res) {
  const { id } = req.params;
  try {
    const result = await FollowUp.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "Follow-up deleted successfully" });
    } else {
      res.status(404).json({ message: "Follow-up not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
