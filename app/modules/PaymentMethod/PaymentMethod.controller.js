import PaymentMethod from "./PaymentMethod.model.js";

// Create a new PaymentMethod (POST)
export const createPaymentMethod = async (req, res) => {
  const { name, image, branch } = req.body;

  try {
    const newPaymentMethod = new PaymentMethod({
      name,
      image,
      branch,
    });

    await newPaymentMethod.save();
    res.status(201).json(newPaymentMethod);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get all PaymentMethods (GET)
export const getAllPaymentMethods = async (req, res) => {
  const branch = req.query?.branch
  try {
    const PaymentMethods = await PaymentMethod.find({branch});
    res.status(200).json(PaymentMethods);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get PaymentMethod by ID (GET)
export const getPaymentMethodById = async (req, res) => {
  try {
    const PaymentMethod = await PaymentMethod.findById(req.params.id);
    if (!PaymentMethod) {
      return res.status(404).json({ message: "PaymentMethod not found" });
    }
    res.status(200).json(PaymentMethod);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Update PaymentMethod by ID (PUT)
export const updatePaymentMethod = async (req, res) => {
  

  try {
    const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPaymentMethod) {
      return res.status(404).json({ message: "PaymentMethod not found" });
    }

    res.status(200).json(updatedPaymentMethod);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Delete PaymentMethod by ID (DELETE)
export const deletePaymentMethod = async (req, res) => {
  try {
    const deletedPaymentMethod = await PaymentMethod.findByIdAndDelete(
      req.params.id
    );

    if (!deletedPaymentMethod) {
      return res.status(404).json({ message: "PaymentMethod not found" });
    }

    res.status(200).json({ message: "PaymentMethod deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get PaymentMethods by branch (GET)
export const getPaymentMethodsByBranch = async (req, res) => {
  const { branch } = req.query;

  try {
    const PaymentMethods = await PaymentMethod.find({ branch });
    res.status(200).json(PaymentMethods);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
