import Packages from "./Package.model.js";

export async function getAllPackages(req, res) {
  const branch = req.params.branch;
  try {
    const result = await Packages.find();
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getAllPackage(req, res) {
  const branch = req.params.branch;
  try {
    const result = await Packages.find({ branch: branch });
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getByIdPackage(req, res) {
  const id = req.params.id;
  try {
    const result = await Packages.findById(id);
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function createPackage(req, res) {
  try {
    const PackagesData = req.body;
    const result = await Packages.create(PackagesData);
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function removePackage(req, res) {
  const id = req.params.id;
  try {
    const result = await Packages.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "Data deleted successfully" });
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function updatePackage(req, res) {
  const id = req.params.id;
  const PackagesData = req.body;
  try {
    const result = await Packages.findByIdAndUpdate(id, PackagesData, {
      new: true,
    });
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getPackageNamesByBranch(req, res) {
  const branch = req.params.branch;
  try {
    const result = await Packages.find({ branch: branch }).select('name');
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
