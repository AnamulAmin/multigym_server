import Departments from "./Departments.model.js";

export async function getAllDepartments(req, res) {
  const branch = req.params.branch;
  try {
    const result = await Departments.find();
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
export async function getAllDepartment(req, res) {
  const branch = req.params.branch;
  try {
    const result = await Departments.find({ branch: branch });
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getByIdDepartment(req, res) {
  const id = req.params.id;
  try {
    const result = await Departments.findById(id);
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function createDepartment(req, res) {
  try {
    const DepartmentsData = req.body;
    const result = await Departments.create(DepartmentsData);
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function removeDepartment(req, res) {
  const id = req.params.id;
  try {
    const result = await Departments.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "Data deleted successfully" });
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function updateDepartment(req, res) {
  const id = req.params.id;
  const DepartmentsData = req.body;
  try {
    const result = await Departments.findByIdAndUpdate(id, DepartmentsData, {
      new: true,
    });
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
