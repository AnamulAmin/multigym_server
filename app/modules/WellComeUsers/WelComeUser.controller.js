import WelcomeUser from './WelComeUser.model.js';


// Create a new visitor (POST)
export const createVisitor = async (req, res) => {
  const { visitorName, visitorMobile, visitorEmail, visitorPicture, branch } =
    req.body;

  try {
    const newVisitor = new WelcomeUser({
      visitorName,
      visitorMobile,
      visitorEmail,
      visitorPicture,
      branch,
    });

    await newVisitor.save();
    res.status(201).json(newVisitor);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get all visitors (GET)
export const getAllVisitors = async (req, res) => {
  try {
    const visitors = await WelcomeUser.find();
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get visitor by ID (GET)
export const getVisitorById = async (req, res) => {
  try {
    const visitor = await WelcomeUser.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }
    res.status(200).json(visitor);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Update visitor by ID (PUT)
export const updateVisitor = async (req, res) => {
  const { visitorName, visitorMobile, visitorEmail, visitorPicture, branch } =
    req.body;

  try {
    const updatedVisitor = await WelcomeUser.findByIdAndUpdate(
      req.params.id,
      { visitorName, visitorMobile, visitorEmail, visitorPicture, branch },
      { new: true, runValidators: true }
    );

    if (!updatedVisitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    res.status(200).json(updatedVisitor);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Delete visitor by ID (DELETE)
export const deleteVisitor = async (req, res) => {
  try {
    const deletedVisitor = await WelcomeUser.findByIdAndDelete(req.params.id);

    if (!deletedVisitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    res.status(200).json({ message: "Visitor deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};


export async function getVisitorsByBranch(req, res) {
  const branch = req.params.branch;
  const { item = 10, page = 1 } = req.query;
  const limit = parseInt(item);
  const skip = (parseInt(page) - 1) * limit;

  try {
    const logs = await WelcomeUser.find({ branch })
      .sort({ send_on: -1 })
      .skip(skip)
      .limit(limit);

    const totalItems = await WelcomeUser.countDocuments({ branch });
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      currentPage: parseInt(page),
      data: logs,
      totalItems: totalItems,
      totalPages: totalPages,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

