import GymMachines from "./GymMachines.model.js";

export async function getAllGymMachines(req, res) {
  try {
    const result = await GymMachines.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getGymMachinesByBranch(req, res) {
  const branch = req.params.branch;
  try {
    const result = await GymMachines.find({ branch: branch });
    res.status(200).json(result); 
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getGymMachineById(req, res) {
  const id = req.params.id;
  try {
    const result = await GymMachines.findById(id);
    res.status(200).json(result); 
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function createGymMachine(req, res) {
  try {
    const gymMachineData = req.body;
    const result = await GymMachines.create(gymMachineData);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function removeGymMachine(req, res) {
  const id = req.params.id;
  try {
    const result = await GymMachines.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "Data deleted successfully" });
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function updateGymMachine(req, res) {
  const id = req.params.id;
  const gymMachineData = req.body;
  try {
    const result = await GymMachines.findByIdAndUpdate(id, gymMachineData, {
      new: true,
    });
    res.status(200).json(result); 
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}