import BeforeSleep from "./DietModels/Sleep.model.js";
import Dinner from "./DietModels/EveningSnacks.js";
import Lunch from "./DietModels/MidMorning.js";
import Breakfast from "./DietModels/MorningPlan.model.js";
import HealthMetrics from "./DietModels/GeneralSuggestion.model.js";
import Diet from "./DietPlan.model.js";
import FoodHabit from "./DietModels/foodHabit_models/RequestDietPlan.model.js";
import Users from "../Users/Users.model.js";
import mongoose from "mongoose";
import FoodHabitQuestion from "./DietModels/foodHabit_models/models/food_habit_question.js";
import convertValuesToDataType from "../../helpers/convertValuesToDataType.js";
import convertToMongooseSchema from "../../helpers/convertToMongooseSchema.js";
import UserMergeDiet from "../UserDietModels/UserMergeDietPlan.model.js";
import UserBeforeSleep from "../UserDietModels/UserDietModels/UserSleep.model.js";
import UserDinner from "../UserDietModels/UserDietModels/UserDinner.js";
import UserLunch from "../UserDietModels/UserDietModels/UserMidMorning.js";
import UserHealthMetrics from "../UserDietModels/UserDietModels/UserGeneralSuggestion.model.js";
import UserBreakfast from "../UserDietModels/UserDietModels/UserMorningPlan.model.js";

export async function getAllDiets(req, res) {
  const branch = req.query.branch;
  try {
    const result = await Diet.find({ branch: branch })
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

export async function getAllDiet(req, res) {
  const branch = req.query?.branch;
  try {
    const result = await Diet.find({ branch: branch })
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

export async function getByIdDiet(req, res) {
  const id = req.params.id;
  try {
    const result = await Diet.findById(id)
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

export const createDiet = async (req, res) => {
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
      doctor
    } = req.body;

    console.log(req.body, "sleepData");

    // Create and save each referenced document
    const sleep = await BeforeSleep.create({ sleep: sleepData });

    const dinner = await Dinner.create(dinnerData);

    const lunch = await Lunch.create(lunchData);

    const breakfast = await Breakfast.create(breakfastData);

    const healthMetrics = await HealthMetrics.create(healthMetricsData);

    // Create the main Diet document with references to the saved documents
    const diet = await Diet.create({
      sleep: sleep._id,
      dinner: dinner._id,
      lunch: lunch._id,
      breakfast: breakfast._id,
      health_metrics: healthMetrics._id,
      branch: branch,
      dietName,
      doctor
    });

    res.status(201).json(diet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDiet = async (req, res) => {
  try {
    const { id } = req.params; // The main Diet document's ID

    console.log(id);

    // Fetch the main Diet document to get references
    // const diet = await Diet.findById(dietId);
    const diet = await Diet.findById(id);

    if (!diet) {
      return res.status(404).json({ error: "Diet not found" });
    }

    // Delete each referenced document
    await BeforeSleep.findByIdAndDelete(diet.sleep);
    await Dinner.findByIdAndDelete(diet.dinner);
    await Lunch.findByIdAndDelete(diet.lunch);
    await Breakfast.findByIdAndDelete(diet.breakfast);
    await HealthMetrics.findByIdAndDelete(diet.health_metrics);

    // Delete the main Diet document
    await Diet.findByIdAndDelete(id);

    res.json({ message: "Diet and related data deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDiet = async (req, res) => {
  try {
    const { id } = req.params; // The main Diet document's ID
    const {
      sleepData,
      dinnerData,
      lunchData,
      breakfastData,
      healthMetricsData,
      branch,
      dietName,
      doctor
    } = req.body;

    console.log("dinnerData", dinnerData);

    // Fetch the main Diet document to get references
    const diet = await Diet.findById(id)
      .populate("sleep")
      .populate("dinner")
      .populate("lunch")
      .populate("breakfast")
      .populate("health_metrics");

    if (!diet) {
      return res.status(404).json({ error: "Diet not found" });
    }

    // Update each referenced document
    if (sleepData) {
      await BeforeSleep.findByIdAndUpdate(diet.sleep._id, sleepData, {
        new: true,
      });
    }
    if (dinnerData) {
      await Dinner.findByIdAndUpdate(diet.dinner._id, dinnerData, {
        new: true,
      });
    }
    if (lunchData) {
      await Lunch.findByIdAndUpdate(diet.lunch._id, lunchData, { new: true });
    }
    if (breakfastData) {
      await Breakfast.findByIdAndUpdate(diet.breakfast._id, breakfastData, {
        new: true,
      });
    }
    if (healthMetricsData) {
      await HealthMetrics.findByIdAndUpdate(
        diet.health_metrics._id,
        healthMetricsData,
        { new: true }
      );
    }

    // Optionally, update the main Diet document itself if needed

    if (branch) {
      diet.branch = branch;
    }

    if (dietName) {
      diet.dietName = dietName;
    }
    if (doctor) {
      diet.doctor = doctor;
    }
    await diet.save();

    res.json(diet); // Send back the updated diet
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createFoodHabit = async (req, res) => {
  try {
    const requestData = req.body;

    const convertedData = convertValuesToDataType(requestData);
    const schemaData = convertToMongooseSchema(convertedData);

    console.log(schemaData, "foodHabitData", requestData, convertedData);

    const userData = await Users.findById(requestData?.userId);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    let FoodHabitUserAnswer;
    if (mongoose.models?.FoodHabitUserAnswer) {
      FoodHabitUserAnswer = mongoose.model("FoodHabitUserAnswer");
    } else {
      FoodHabitUserAnswer = mongoose.model("FoodHabitUserAnswer", schemaData);
    }

    // Fetch `FoodHabit` and populate `food_habit_user_answer_id`
    const foodHabitData = await FoodHabit.findById(
      userData?.food_habit_id
    ).populate("food_habit_user_answer_id"); // Populate this field

    // console.log(foodHabitData, "foodHabitData");

    if (foodHabitData && foodHabitData.food_habit_user_answer_id) {
      const answerReport = await FoodHabitUserAnswer.findByIdAndUpdate(
        foodHabitData.food_habit_user_answer_id,
        requestData,
        { new: true }
      );

      console.log(answerReport, "answerReport", requestData);

      const foodHabitReport = await FoodHabit.findByIdAndUpdate(
        foodHabitData._id,
        {
          isActive: true,
          branch: requestData?.branch,
          food_habit_user_answer_id: answerReport._id,
        },
        { new: true }
      );

      
      const userDietReport = await UserMergeDiet.findById(foodHabitData?.set_diet_id)

      const beforeSleepReport = await UserBeforeSleep.findByIdAndDelete(userDietReport?.sleep)
    const dinnerReport = await UserDinner.findByIdAndDelete(userDietReport?.dinner)
    const lunchReport = await UserLunch.findByIdAndDelete(userDietReport?.lunch)
    const healthMetricsReport = await UserHealthMetrics.findByIdAndDelete(userDietReport?.health_metrics)
    const breakfastReport = await UserBreakfast.findByIdAndDelete(userDietReport?.breakfast)

    const userDietDeleteReport = await UserMergeDiet.findByIdAndDelete(foodHabitData?.set_diet_id)


      // console.log(beforeSleepReport, dinnerReport , lunchReport , healthMetricsReport, breakfastReport, userDietDeleteReport , "userDietReport")
      const userReport = await Users.findByIdAndUpdate(
        requestData?.userId,
        { food_habit_id: foodHabitData._id },
        { new: true }
      );

      return res
        .status(201)
        .json({ answerReport, foodHabitReport, user: userReport });
    }


    const answerReport = await FoodHabitUserAnswer.create(requestData);
    // const answer_updateReport = await FoodHabitUserAnswer.findByIdAndUpdate(
    //   answerReport._id,
    //   requestData,
    //   { new: true }
    // );

    console.log( requestData, "requestData", answerReport);

    const foodHabitReport = await FoodHabit.create({
      food_habit_user_answer_id: answerReport._id,
      user: requestData?.userId,
      isActive: true,
      branch: requestData?.branch,
    });

    const userReport = await Users.findByIdAndUpdate(
      requestData?.userId,
      { food_habit_id: foodHabitReport._id },
      { new: true }
    );

    res.status(201).json({ answerReport, foodHabitReport, user: userReport });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ error: error.message });
  }
};

export async function getByIdFoodHabit(req, res) {
  const id = req.params.id;
  const requestData = req.body;

  const convertedData = convertValuesToDataType(requestData);
  const schemaDefinition = convertToMongooseSchema(convertedData);
  const schemaData = new mongoose.Schema(schemaDefinition);

  let FoodHabitUserAnswer;
  if (mongoose.models?.FoodHabitUserAnswer) {
    FoodHabitUserAnswer = mongoose.model("FoodHabitUserAnswer");
  } else {
    FoodHabitUserAnswer = mongoose.model("FoodHabitUserAnswer", schemaData);
  }

  try {
    const result = await FoodHabit.findById(id).populate("user");
    // .populate("food_habit_user_answer_id");

    const foodHabitUserAnswer = await FoodHabitUserAnswer.findById(
      result.food_habit_user_answer_id
    );

    if (!result) {
      return res.status(404).json({ error: "FoodHabit not found" });
    }

    const userReport = await Users.findById(result.user);

    res.json({ data: result, foodHabitUserAnswer, user: userReport });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getAllFoodHabit(req, res) {
  const branch = req.query?.branch;
  try {
    const result = await FoodHabit.find({ isActive: true, branch: branch }).populate("user");
    console.log(branch, "branch", result);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getAllDietBySearch(req, res) {
  const { branch, search } = req.query;

  const query = {
    role: { $ne: "member" },
  };

  if (branch) {
    query.branch = branch;
  }
  try {
    if (search) {
      query.$or = [{ dietName: { $regex: new RegExp(search, "i") } }];

      const result = await Diet.find(query).select({
        dietName: 1,
      });
      res.status(200).json(result);
      return;
    }

    const result = await Diet.find(query)
      .select({
        dietName: 1,
      })
      .sort({ created_at: -1 })
      .limit(6);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function updateFoodHabit(req, res) {
  const id = req.params.id;
  const foodHabitData = req.body;

  const filter = { $or: [{ user: id }, { _id: id }] };

  try {
  const foodHabitReport = await FoodHabit.findOne(filter);

  const dietReport = await Diet.findById(foodHabitData.set_diet_id)
  .populate("sleep")
  .populate("dinner")
  .populate("lunch")
  .populate("breakfast")
  .populate("health_metrics");


  console.log(foodHabitReport, dietReport, "foodHabitReport");
  
  
  if(dietReport){


    if (!foodHabitReport) {
      res.status(404).send({ error: "Result not Found!" });
      return;
    }

    const sleep = {
      sleep: dietReport?.sleep?.sleep,
    };
    const dinner = {
    roti: dietReport?.dinner?.roti,
    rice: dietReport?.dinner?.rice,
  fish_meat:  dietReport?.dinner?.fish_meat,
  pulse: dietReport?.dinner?.pulse,
  shack: dietReport?.dinner?.shack,
  vegetable: dietReport?.dinner?.vegetable,
  salad: dietReport?.dinner?.salad,
  extra: dietReport?.dinner?.extra,
    };


    const lunch = {
      lunch_rice: dietReport?.lunch?.lunch_rice,
  fish_meat: dietReport?.lunch?.fish_meat,
  pulse: dietReport?.lunch?.pulse,
  shack: dietReport?.lunch?.shack,
  vegetable: dietReport?.lunch?.vegetable,
  salad: dietReport?.lunch?.salad,
  extra: dietReport?.lunch?.extra,
    };
    const breakfast = {
      roti: dietReport?.breakfast?.roti,
  egg: dietReport?.breakfast?.egg,
  vegetable: dietReport?.breakfast?.vegetable,
  fruit: dietReport?.breakfast?.fruit,
  extra: dietReport?.breakfast?.extra,
    };
    const health_metrics = {weight: dietReport?.health_metrics?.weight,
      height: dietReport?.health_metrics?.height,
      ideal_weight: dietReport?.health_metrics?.ideal_weight,
      extra_weight: dietReport?.health_metrics?.extra_weight,
      age: dietReport?.health_metrics?.age,
      bp: dietReport?.health_metrics?.bp,
      calorie: dietReport?.health_metrics?.calorie,
      water: dietReport?.health_metrics?.water,
      sugar: dietReport?.health_metrics?.sugar,
      oil: dietReport?.health_metrics?.oil,
      suggestion: dietReport?.health_metrics?.suggestion,
      food_to_avoid: dietReport?.health_metrics?.food_to_avoid,
  points_to_note: dietReport?.health_metrics?.points_to_note,
  weekly: dietReport?.health_metrics?.weekly,
  vegetables: dietReport?.health_metrics?.vegetables,
  fruits: dietReport?.health_metrics?.fruits,
    };

    

    // console.log(sleep, dinner, lunch, breakfast, health_metrics , "sleep, dinner, lunch, breakfast");


    const beforeSleepReport = await UserBeforeSleep.create(sleep)
    const dinnerReport = await UserDinner.create(dinner)
    const lunchReport = await UserLunch.create(lunch)
    const healthMetricsReport = await UserHealthMetrics.create(health_metrics)
    const breakfastReport = await UserBreakfast.create(breakfast)
  
  
    
      // console.log(beforeSleepReport, dinnerReport , lunchReport, healthMetricsReport, beforeSleepReport, " beforeSleep")
    const mergeDietObj = {
      sleep: beforeSleepReport._id,
      dinner: dinnerReport._id,
      lunch: lunchReport._id,
      breakfast: breakfastReport._id ,
      health_metrics: healthMetricsReport._id,
      branch: dietReport.branch,
      dietName: dietReport.dietName,
    
    }

    const userMergeDietReport = await UserMergeDiet.create(mergeDietObj);
    console.log("margeResult", userMergeDietReport);
    
      

      foodHabitData.set_diet_id = userMergeDietReport._id;
      foodHabitData.isActive = false;

      console.log(foodHabitData, "foodHabitData");
  
      
  
      const result = await FoodHabit.findOneAndUpdate(filter, foodHabitData, {
        new: true,
      });
      console.log(result, "result");
  
      const updateUserData = await Users.findByIdAndUpdate(
        foodHabitReport.user,
        { food_habit_id: result._id },
        {
          new: true,
        }
      );
    return   res.status(200).json({ updateUserData, result });
  }

  res.status(404).json({ error: "Result not Found!" });



  } catch (err) {
    console.log(err, "error");
    res.status(500).send({ error: err.message });
  }
}

// Create a new FoodHabitQuestion (POST)
export const createFoodHabitQuestion = async (req, res) => {
  const { name, label, field_type, branch } = req.body;

  try {
    const newFoodHabitQuestion = new FoodHabitQuestion({
      name,
      label,
      branch,
      field_type,
    });

    await newFoodHabitQuestion.save();
    res.status(201).json(newFoodHabitQuestion);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get all FoodHabitQuestions (GET)
export const getAllFoodHabitQuestions = async (req, res) => {
  const { branch } = req.query;
  const filters = {};
  if (branch) {
    filters.branch = branch;
  }
  try {
    const all_food_habit_questions = await FoodHabitQuestion.find(filters);

    res.status(200).json(all_food_habit_questions);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get FoodHabitQuestion by ID (GET)
export const getFoodHabitQuestionById = async (req, res) => {
  try {
    const foodHabitReport = await FoodHabitQuestion.findById(req.params.id);
    if (!foodHabitReport) {
      return res.status(404).json({ message: "FoodHabit Question not found" });
    }
    res.status(200).json(foodHabitReport);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Update FoodHabitQuestion by ID (PUT)
export const updateFoodHabitQuestion = async (req, res) => {
  try {
    const updatedFoodHabitQuestion = await FoodHabitQuestion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedFoodHabitQuestion) {
      return res.status(404).json({ message: "FoodHabitQuestion not found" });
    }

    res.status(200).json(updatedFoodHabitQuestion);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Delete FoodHabitQuestion by ID (DELETE)
export const deleteFoodHabitQuestion = async (req, res) => {
  try {
    const deletedFoodHabitQuestion = await FoodHabitQuestion.findByIdAndDelete(
      req.params.id
    );

    if (!deletedFoodHabitQuestion) {
      return res.status(404).json({ message: "FoodHabitQuestion not found" });
    }

    res.status(200).json({ message: "FoodHabitQuestion deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get FoodHabitQuestions by branch (GET)
export const getFoodHabitQuestionsByBranch = async (req, res) => {
  const { branch } = req.query;

  try {
    const FoodHabitQuestions = await FoodHabitQuestion.find({ branch });
    res.status(200).json(FoodHabitQuestions);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
