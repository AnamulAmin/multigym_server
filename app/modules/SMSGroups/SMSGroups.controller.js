import SMSGroups from "./SMSGroups.model.js";

export async function getAllGroups(req, res) {
  try {
    const result = await SMSGroups.find();
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getGroupByBranch(req, res) {
  const branch = req.params.branch;
  try {
    const result = await SMSGroups.find({ branch });
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getGroupById(req, res) {
  const id = req.params.id;
  try {
    const result = await SMSGroups.findById(id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).send({ error: "Group not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function createGroup(req, res) {
  try {
    // Log the request body to see what is being received
    console.log('Request body:', req.body);

    const groupData = req.body;
    const result = await SMSGroups.create(groupData);
    res.status(201).json(result);
  } catch (err) {
    console.error('Error creating group:', err);
    res.status(500).send({ error: err.message });
  }
}


export async function removeGroup(req, res) {
  const id = req.params.id;
  try {
    const result = await SMSGroups.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "Group deleted successfully" });
    } else {
      res.status(404).json({ error: "Group not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function updateGroup(req, res) {
  const id = req.params.id;
  const groupData = req.body;
  try {
    const result = await SMSGroups.findByIdAndUpdate(id, groupData, {
      new: true,
    });
    if (result) {
      res.json(result);
    } else {
      res.status(404).send({ error: "Group not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
