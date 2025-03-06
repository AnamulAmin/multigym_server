import Branch from "./Branch.model.js";

export async function getAllBranches(req, res) {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function updateEmailSettings(req, res) {
  const { branchcode } = req.params;
  const { emailSettings } = req.body;

  try {
    const branch = await Branch.findOne({ branch: branchcode }); // Corrected here

    if (!branch) {
      return res
        .status(404)
        .json({ message: "Branch not found. Please add a branch first." });
    }

    branch.emailSettings = {
      ...branch.emailSettings,
      expirationReminder60Days: emailSettings.expirationReminder60Days,
      birthdayWishes: emailSettings.birthdayWishes,
      subscriptionRenewalReminder: emailSettings.subscriptionRenewalReminder,
    };

    const updatedBranch = await branch.save();

    res.status(200).json(updatedBranch);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getBranchByCode(req, res) {
  const branchcode = req.params.branchcode;
  try {
    const branch = await Branch.findOne({ branch: branchcode });

    if (branch) {
      // Count other branches
      const otherBranchesCount = await Branch.find(
        {},
        { name: 1, branch: 1, _id: 0 }
      );

      // Combine branch data with otherBranchesCount at the same level
      res.json({
        ...branch.toObject(),
        otherBranchesCount,
      });
    } else {
      // If branch is not found, return other branches' info
      const otherBranches = await Branch.find(
        {},
        { name: 1, branch: 1, _id: 0 }
      );
      res.status(404).json({
        name: "Branch not found",
        otherBranches: otherBranches,
      });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function updateAnnouncement(req, res) {
  const { branchcode } = req.params;
  const { announcementBody, announcementEnabled, announcementPurpose } =
    req.body;

  try {
    const branch = await Branch.findOne({ branch: branchcode }); // Corrected here

    if (!branch) {
      return res
        .status(404)
        .json({ message: "Branch not found. Please add a branch first." });
    }

    branch.announcementBody = announcementBody || branch.announcementBody;
    branch.announcementEnabled =
      announcementEnabled !== undefined
        ? announcementEnabled
        : branch.announcementEnabled;
    branch.announcementPurpose =
      announcementPurpose || branch.announcementPurpose;

    const updatedBranch = await branch.save();

    res.status(200).json(updatedBranch);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function createBranch(req, res) {
  try {
    const branchData = req.body;
    console.log(branchData);

    if (!branchData.branch) {
      return res
        .status(400)
        .json({ message: "Branch code is required and must be unique." });
    }

    // Check if the branch code already exists
    const existingBranch = await Branch.findOne({ branch: branchData.branch });
    if (existingBranch) {
      return res.status(400).json({
        message: "Branch code must be unique. This code already exists.",
      });
    }

    // Set default values for optional fields
    branchData.announcementBody = branchData.announcementBody || "";
    branchData.announcementEnabled = branchData.announcementEnabled || false;
    branchData.announcementPurpose =
      branchData.announcementPurpose || "General Announcement";

    branchData.emailSettings = {
      expirationReminder60Days: {
        template: "Sample Expiration Reminder Template",
        enabled: false,
      },
      birthdayWishes: {
        template: "Sample Birthday Wishes Template",
        enabled: false,
      },
      subscriptionRenewalReminder: {
        template: "Sample Subscription Renewal Template",
        enabled: false,
      },
    };

    const newBranch = await Branch.create(branchData);
    console.log("Created new branch:", newBranch);

    res.json(newBranch);
  } catch (err) {
    console.error("Error creating branch:", err.message);
    if (err.code === 11000) {
      res.status(400).json({ message: "Branch code must be unique." });
    } else {
      res.status(500).send({ error: err.message });
    }
  }
}

export async function updateBranch(req, res) {
  const id = req.params.id;
  const branchData = req.body;
  try {
    const updatedBranch = await Branch.findByIdAndUpdate(id, branchData, {
      new: true,
    });
    if (updatedBranch) {
      res.json(updatedBranch);
    } else {
      res.status(404).json({ message: "Branch not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function deleteBranch(req, res) {
  const id = req.params.id;
  try {
    const deletedBranch = await Branch.findByIdAndDelete(id);
    if (deletedBranch) {
      res.status(200).json({ message: "Branch deleted successfully" });
    } else {
      res.status(404).json({ message: "Branch not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getEmailSettingsByBranchCode(req, res) {
  const { branchcode } = req.params;

  try {
    const branch = await Branch.findOne(
      { branch: branchcode },
      { emailSettings: 1, _id: 0 }
    ); // Corrected here

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.status(200).json(branch.emailSettings);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
