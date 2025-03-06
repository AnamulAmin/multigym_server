import SMSCampaign from "./SMSCampaign.model.js";

// Create a new SMS campaign
export async function createSMSCampaign(req, res) {
  try {
    const campaignData = req.body;
    console.log("Received SMS Campaign Data:", campaignData); // Log the received data
    const result = await SMSCampaign.create(campaignData);
    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating SMS Campaign:", err.message); // Log any errors that occur
    res.status(500).send({ error: err.message });
  }
}

// Get an SMS campaign by ID
export async function getSMSCampaignById(req, res) {
  const id = req.params.id;
  try {
    const result = await SMSCampaign.findById(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Delete an SMS campaign by ID
export async function deleteSMSCampaign(req, res) {
  const id = req.params.id;
  try {
    const result = await SMSCampaign.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "SMS Campaign deleted successfully" });
    } else {
      res.status(404).json({ message: "SMS Campaign not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

// Get SMS campaigns filtered by branch with pagination
export async function getSMSCampaignsByBranch(req, res) {
  const branch = req.params.branch;
  const { item = 10, page = 1 } = req.query; // default to 10 items per page and first page if not provided

  const limit = parseInt(item);
  const skip = (parseInt(page) - 1) * limit;

  try {
    const campaigns = await SMSCampaign.find({ branch })
      .sort({ send_on: -1 }) // sort by send_on descending (latest first)
      .skip(skip)
      .limit(limit);

    const totalItems = await SMSCampaign.countDocuments({ branch });
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      currentPage: parseInt(page),
      data: campaigns,
      totalItems: totalItems,
      totalPages: totalPages,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
