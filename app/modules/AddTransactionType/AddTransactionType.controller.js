import TransactionType from "./AddTransactionType.model.js";

// Create a new TransactionType (POST)
export const createTransactionType = async (req, res) => {
  const { name, image, branch } = req.body;

  try {
    const newTransactionType = new TransactionType(req.body);

    await newTransactionType.save();
    res.status(201).json(newTransactionType);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get all TransactionTypes (GET)
export const getAllTransactionTypes = async (req, res) => {
  const {branch} = req.query;
  const filter = {};
  if (branch) {
    filter.branch = branch;
  }
  try {
    const TransactionTypes = await TransactionType.find();
    res.status(200).json(TransactionTypes);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get TransactionType by ID (GET)
export const getTransactionTypeById = async (req, res) => {
  try {
    const transactionTypeReport = await TransactionType.findById(req.params.id);
    if (!transactionTypeReport) {
      return res.status(404).json({ message: "TransactionType not found" });
    }
    res.status(200).json(transactionTypeReport);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Update TransactionType by ID (PUT)
export const updateTransactionType = async (req, res) => {
  try {
    const updatedTransactionType = await TransactionType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTransactionType) {
      return res.status(404).json({ message: "TransactionType not found" });
    }

    res.status(200).json(updatedTransactionType);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Delete TransactionType by ID (DELETE)
export const deleteTransactionType = async (req, res) => {
  try {
    const deletedTransactionType = await TransactionType.findByIdAndDelete(
      req.params.id
    );

    if (!deletedTransactionType) {
      return res.status(404).json({ message: "TransactionType not found" });
    }

    res.status(200).json({ message: "TransactionType deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get TransactionTypes by branch (GET)
export const getTransactionTypesByBranch = async (req, res) => {
  const { branch } = req.query;

  try {
    const TransactionTypes = await TransactionType.find({ branch });
    res.status(200).json(TransactionTypes);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
