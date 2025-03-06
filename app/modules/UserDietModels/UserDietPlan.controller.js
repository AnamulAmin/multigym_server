
import UserDinner from "./UserDietModels/UserDinner";
import UserHealthMetrics from "./UserDietModels/UserGeneralSuggestion.model";
import UserLunch from "./UserDietModels/UserMidMorning";
import UserBreakfast from "./UserDietModels/UserMorningPlan.model";
import UserBeforeSleep from "./UserDietModels/UserSleep.model";
import UserMergeDiet from "./UserMergeDietPlan.model";


export async function getAllUserDiets(req, res) {
  const branch = req.params.branch;
  try {
    const result = await UserMergeDiet.find({ branch: branch })
      .populate("sleep")
      .populate("dinner")
      .populate("lunch")
      .populate("breakfast")
      .populate("health_metrics");

    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getAllUserDiet(req, res) {
  const branch = req.query?.branch;
  try {
    const result = await UserMergeDiet.find()
      .populate("sleep")
      .populate("dinner")
      .populate("lunch")
      .populate("breakfast")
      .populate("health_metrics");

    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getByIdUserDiet(req, res) {
  const id = req.params.id;
  try {
    const result = await UserMergeDiet.findById(id)
      .populate("sleep")
      .populate("dinner")
      .populate("lunch")
      .populate("breakfast")
      .populate("health_metrics");
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export const createUserDiet = async (req, res) => {
  try {
    // Extract data from the request body
    const {
      sleepData,
      dinnerData,
      lunchData,
      breakfastData,
      healthMetricsData,
      branch,
      dietName,
    } = req.body;

    console.log(req.body, "sleepData");

    // Create and save each referenced document
    const sleep = await UserBeforeSleep.create({ sleep: sleepData });

    const dinner = await UserDinner.create(dinnerData);

    const lunch = await UserLunch.create(lunchData);

    const breakfast = await UserBreakfast.create(breakfastData);

    const healthMetrics = await UserHealthMetrics.create(healthMetricsData);

    // Create the main UserDiet document with references to the saved documents
    const userDietResult = await UserMergeDiet.create({
      sleep: sleep._id,
      dinner: dinner._id,
      lunch: lunch._id,
      breakfast: breakfast._id,
      health_metrics: healthMetrics._id,
      branch: branch,
      dietName,
    });

    res.status(201).json(userDietResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUserDiet = async (req, res) => {
  try {
    const { id } = req.params; // The main UserDiet document's ID

    console.log(id);

    // Fetch the main UserDiet document to get references
    // const Userdiet = await UserMergeDiet.findById(UserdietId);
    const Userdiet = await UserMergeDiet.findById(id);

    if (!Userdiet) {
      return res.status(404).json({ error: "UserDiet not found" });
    }

    // Delete each referenced document
    await UserBeforeSleep.findByIdAndDelete(Userdiet.sleep);
    await UserDinner.findByIdAndDelete(Userdiet.dinner);
    await UserLunch.findByIdAndDelete(Userdiet.lunch);
    await UserBreakfast.findByIdAndDelete(Userdiet.breakfast);
    await UserHealthMetrics.findByIdAndDelete(Userdiet.health_metrics);

    // Delete the main UserDiet document
    await UserDiet.findByIdAndDelete(id);

    res.json({ message: "UserDiet and related data deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserDiet = async (req, res) => {
  try {
    const { id } = req.params; // The main UserDiet document's ID
    const {
      sleepData,
      dinnerData,
      lunchData,
      breakfastData,
      healthMetricsData,
      branch,
      UserdietName,
    } = req.body;

    // Fetch the main UserDiet document to get references
    const Userdiet = await UserMergeDiet.findById(id)
      .populate("sleep")
      .populate("dinner")
      .populate("lunch")
      .populate("breakfast")
      .populate("health_metrics");

    if (!Userdiet) {
      return res.status(404).json({ error: "UserDiet not found" });
    }

    // Update each referenced document
    if (sleepData) {
      await UserBeforeSleep.findByIdAndUpdate(Userdiet.sleep._id, sleepData, {
        new: true,
      });
    }
    if (dinnerData) {
      await UserDinner.findByIdAndUpdate(Userdiet.dinner._id, dinnerData, {
        new: true,
      });
    }
    if (lunchData) {
      await UserLunch.findByIdAndUpdate(Userdiet.lunch._id, lunchData, { new: true });
    }
    if (breakfastData) {
      await UserBreakfast.findByIdAndUpdate(Userdiet.breakfast._id, breakfastData, {
        new: true,
      });
    }
    if (healthMetricsData) {
      await UserHealthMetrics.findByIdAndUpdate(
        Userdiet.health_metrics._id,
        healthMetricsData,
        { new: true }
      );
    }

    // Optionally, update the main UserDiet document itself if needed

    if (branch) {
      Userdiet.branch = branch;
    }

    if (UserdietName) {
      Userdiet.dietName = UserdietName;
    }
    await Userdiet.save();

    res.json(Userdiet); // Send back the updated Userdiet
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
