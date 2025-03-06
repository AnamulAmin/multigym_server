import SenderID from "./SenderID.model.js";

export async function getAllSenderIDs(req, res) {
  const branch = req.params.branch;
  try {
    const result = await SenderID.find();
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getSenderIDsByBranch(req, res) {
  const branch = req.params.branch;
  try {
    const result = await SenderID.find({ branch: branch });
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getSenderIDById(req, res) {
  const id = req.params.id;
  try {
    const result = await SenderID.findById(id);
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function createSenderID(req, res) {
  try {
    const senderIDData = req.body;
    const result = await SenderID.create(senderIDData);
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function removeSenderID(req, res) {
  const id = req.params.id;
  try {
    const result = await SenderID.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "Sender ID deleted successfully" });
    } else {
      res.status(404).json({ message: "Sender ID not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function updateSenderID(req, res) {
  const id = req.params.id;
  const senderIDData = req.body;
  try {
    const result = await SenderID.findByIdAndUpdate(id, senderIDData, {
      new: true,
    });
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
