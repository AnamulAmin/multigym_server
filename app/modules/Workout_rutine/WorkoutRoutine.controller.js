import WorkoutRoutine from './WorkoutRoutine.model.js';
import mongoose from 'mongoose';
import convertValuesToDataType from '../../helpers/convertValuesToDataType.js';
import convertToMongooseSchema from '../../helpers/convertToMongooseSchema.js';
import Users from '../Users/Users.model.js';
import Workouts from '../Workout/Workout.model.js';
import WorkoutQuestionModel from './models/WorkoutQuestionModel.js';
import WorkoutAnswerModel from './models/WorkoutAnswerModel.js';
import WorkoutCopyRoutine from '../Workout_copy_rutine/WorkoutCopyRoutine.model.js';


export const createRoutine = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log incoming request data
    const routine = new WorkoutRoutine(req.body);
    const savedRoutine = await routine.save();
    res.status(201).json(savedRoutine);
  } catch (error) {
    console.error('Error creating routine:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getAllRoutines = async (req, res) => {
  const { branch } = req.query;

  const filters = {};

  if (branch) {
    filters.branchName = branch;
  }
  try {
    const routines = await WorkoutRoutine.find(filters)

    res.status(200).json(routines);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// export const addUserToRoutine = async (req, res) => {
//   const { userIds } = req.body;
//   const { id } = req.params;
//   console.log("add user routine route hitted");
//   console.log("userIds" , userIds);
//   console.log('id',id);

//   try {
//     const routine = await WorkoutRoutine.findById(id);
//     if (!routine) {
//       return res.status(404).json({ message: "Routine not found" });
//     }

//     routine.user.push(...userIds);
//     await routine.save();

//     res.status(200).json(routine);
//   } catch (error) {
//     console.log(error.message)
//     res.status(500).send({ error: error.message });
//   }
// };
export const addUserToRoutine = async (req, res) => {
  let { routineId, branch } = req.body; 
  const { id } = req.params;


  try {
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid routine ID" });
    } 

    const existWorkoutRoutine = await WorkoutRoutine.findById(routineId).populate("workouts").populate({
      path: 'workouts.exercises.workout',
      model: 'Workouts',
    });

    if(!existWorkoutRoutine){
      return res.status(400).json({ message: "Routine Not Found!" });
    }


    const userResult = await Users.findById(id);

    if(!userResult){
      return res.status(400).json({ message: "User Not Found!" });
    }

    const existRoutine = await WorkoutCopyRoutine.findOne({userId: id})

    const copyData = {
      routineName: existWorkoutRoutine.routineName,
      difficulty: existWorkoutRoutine.difficulty,
      days: existWorkoutRoutine.days,
      workouts: existWorkoutRoutine?.workouts.map((item) => {
        const copy_item1 = {
            day: item.day,
            dayName: item.dayName,
            exercises: item.exercises.map((item) => {
                const copy_item2 = {
                    workout: item.workout,
                    sets: item.sets,
                    reps: item.reps
                }
                // console.log(copy_item2, "copy_item2");
                return copy_item2;
            })
        }

        // console.log(copy_item1, "copy_item1");
        return copy_item1;
      } ),
      
      branchName: existWorkoutRoutine.branchName,
      userId : id
    }

    if(existRoutine){
  
      console.log(copyData, "copyResult");
  
      const delete_result = await WorkoutCopyRoutine.findByIdAndDelete(existRoutine._id);

      console.log(delete_result, "delete_result", existRoutine._id, "existRoutine._id");
      const copy_result = await WorkoutCopyRoutine.create(copyData);
      // const copy_result = await WorkoutCopyRoutine.create(copyData);
      console.log(copy_result, copy_result?.workouts[0]?.exercises, "copy_result?.workouts?.exercises updated", existRoutine._id, "existRoutine._id");
  

  
  
    
        const result = await Workouts.findOneAndUpdate({user: userResult._id}, {workout_routine_id: copy_result._id, user: userResult._id}, {
          new: true,
        });
        console.log(result, "result");
    
        const updateUserData = await Users.findByIdAndUpdate(
          userResult._id,
          { workout_habit_id: result._id },
          {
            new: true,
          }
        );
       return res.status(200).json({ user: updateUserData, workout: result, routine: copy_result  });
       
      }
      
      const copy_result = await WorkoutCopyRoutine.create(copyData);
      console.log( copy_result?.workouts[0]?.exercises, "copy_result?.workouts?.exercises new", copyData?.workouts[0]?.exercises);
  
      
  
  
    
        const result = await Workouts.create({workout_routine_id: copy_result._id, user: userResult._id, isActive: false, branch});
        console.log(result, "result");
    
        const updateUserData = await Users.findByIdAndUpdate(
          userResult._id,
          { workout_habit_id: result._id },
          {
            new: true,
          }
        );
       return res.status(200).json({ user: updateUserData, workout: result, routine: copy_result  });


  
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
};

// export const getRoutinesByUser = async (req, res) => {
//   try {
//     const routines = await WorkoutRoutine.find({ user: req.user._id }).populate({
//       path: 'workouts.exercises.workout',
//       select: 'name muscle equipment instructions photo video'
//     });

//     res.status(200).json(routines);
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// };
export const getRoutinesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const branch = req.query.branch;

    const filters = { user: userId };
    if (branch) filters.branchName = branch;

    // Fetch and populate without attempting to sort in the population stage
    const routines = await WorkoutCopyRoutine.find(filters)
      // .populate({
      //   path: 'workouts.exercises.workout',
      //   model: 'Workouts',
      // });

    // Sort each workout's exercises to have "Stretching" appear first
    routines.forEach((routine) => {
      routine.workouts.forEach((workout) => {
        workout.exercises.sort((a, b) => {
          if (a.workout.muscle === 'Stretching') return -1;
          if (b.workout.muscle === 'Stretching') return 1;
          return 0;
        });
      });
    });

    if (!routines || routines.length === 0) {
      return res.status(404).json({ message: 'No routines found for this user' });
    }

    res.status(200).json(routines);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};



export const getRoutineById = async (req, res) => {
  console.log(req.params.id, "req.params.id");
  try {
    const routine = await WorkoutRoutine.findById(req.params.id)

    if (!routine) {
      return res.status(404).json({ message: "Routine not found" });
    }

    res.status(200).json(routine);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const getRoutinesByBranch = async (req, res) => {
  const { branchName } = req.query;
  
  try {
    const routines = await WorkoutRoutine.find({ branchName })

    res.status(200).json(routines);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};



export const updateRoutine = async (req, res) => {
  const { routineName, difficulty, days, workouts, branchName } = req.body;

  try {
    const routine = await WorkoutRoutine.findByIdAndUpdate(
      req.params.id,
      { routineName, difficulty, days, workouts, branchName },
      { new: true, runValidators: true }
    );

    if (!routine) {
      return res.status(404).json({ message: "Routine not found" });
    }

    res.status(200).json(routine);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const deleteRoutine = async (req, res) => {
  try {
    const routine = await WorkoutRoutine.findByIdAndDelete(req.params.id);

    if (!routine) {
      return res.status(404).json({ message: "Routine not found" });
    }

    res.status(200).json({ message: "Routine deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};





// ================================================== workout habit functionality==================================================
export const createWorkoutHabit = async (req, res) => {
  try {
    const requestData = req.body;
    requestData.isActive = false;


    const convertedData = convertValuesToDataType(requestData);
    const schemaData = convertToMongooseSchema(convertedData);


    console.log(schemaData, "workoutHabitData", requestData, convertedData);

    const userData = await Users.findById(requestData?.userId);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }



    let WorkoutUserAnswerModel;
    if (mongoose.models?.workout_user_answers) {
      WorkoutUserAnswerModel = mongoose.model("workout_user_answers");
    } else {
      WorkoutUserAnswerModel = mongoose.model("workout_user_answers", schemaData);
    }

    // Fetch `WorkoutHabit` and populate `workout_habit_user_answer_id`
    const workoutHabitData = await Workouts.findOne(
      {user: userData?._id}
    ).populate("workout_habit_user_answer_id"); // Populate this field
    

    

    console.log(workoutHabitData, "workoutHabitData", userData);

    if (workoutHabitData && workoutHabitData?.workout_habit_user_answer_id) {


      const answerReport = await WorkoutUserAnswerModel.findByIdAndUpdate(
        workoutHabitData?.workout_habit_user_answer_id,
        requestData,
        { new: true }
      );

      const WorkoutHabitReport = await Workouts.findByIdAndUpdate(
        workoutHabitData._id,
        {
          isActive: true,
          branch: requestData?.branch,
          workout_habit_user_answer_id: answerReport._id,
        },
        { new: true }
      );

      
    //   const userworkoutReport = await UserMergeDiet.findById(workoutHabitData?.set_diet_id)

    //   const beforeSleepReport = await UserBeforeSleep.findByIdAndDelete(userworkoutReport?.sleep)
    // const dinnerReport = await UserDinner.findByIdAndDelete(userworkoutReport?.dinner)
    // const lunchReport = await UserLunch.findByIdAndDelete(userworkoutReport?.lunch)
    // const healthMetricsReport = await UserHealthMetrics.findByIdAndDelete(userworkoutReport?.health_metrics)
    // const breakfastReport = await UserBreakfast.findByIdAndDelete(userworkoutReport?.breakfast)

    const userDietDeleteReport = await WorkoutCopyRoutine.findByIdAndDelete(workoutHabitData?.workout_routine_id)
    
    console.log(userDietDeleteReport, "userDietDeleteReport", workoutHabitData, "workoutHabitData", WorkoutHabitReport, "WorkoutHabitReport")
    
    
    //   console.log(beforeSleepReport, dinnerReport , lunchReport , healthMetricsReport, breakfastReport, userDietDeleteReport , "userworkoutReport")
    const userReport = await Users.findByIdAndUpdate(
      requestData?.userId,
      { workout_habit_id: workoutHabitData._id },
      { new: true }
    );
    
    return res
    .status(201)
    .json({ answerReport, WorkoutHabitReport, user: userReport });
  }
  
  console.log(requestData, "requestData");
  
  const answerReport = await WorkoutUserAnswerModel.create(requestData);
  
  if(answerReport){
    const answer_updateReport = await WorkoutUserAnswerModel.findByIdAndUpdate(
      answerReport._id,
      requestData,
      { new: true }
    );

    const workoutResult = await Workouts.findById(userData?.workout_habit_id);
    
    
    const userDietDeleteReport = await WorkoutCopyRoutine.findByIdAndDelete(workoutResult?.workout_routine_id)

    console.log(userDietDeleteReport, "userDietDeleteReport", workoutResult)
    

  }

    const WorkoutHabitReport = await Workouts.create({
      workout_habit_user_answer_id: answerReport._id,
      user: requestData?.userId,
      isActive: true,
      branch: requestData?.branch,
    });

    const userReport = await Users.findByIdAndUpdate(
      requestData?.userId,
      { workout_habit_id: WorkoutHabitReport._id },
      { new: true }
    );

    res.status(201).json({ answerReport, WorkoutHabitReport, user: userReport });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ error: error.message });
  }
};

export async function getByIdWorkoutHabit(req, res) {
  const id = req.params.id;
  const requestData = req.body;

  const convertedData = convertValuesToDataType(requestData);
  const schemaDefinition = convertToMongooseSchema(convertedData);
  const schemaData = new mongoose.Schema(schemaDefinition);

  let WorkoutUserAnswerModel;
  if (mongoose.models?.workout_user_answers) {
    WorkoutUserAnswerModel = mongoose.model("workout_user_answers");
  } else {
    WorkoutUserAnswerModel = mongoose.model("workout_user_answers", schemaData);
  }

  try {
    const result = await Workouts.findById(id).populate("user").populate("workout_routine_id").populate("workout_routine_id.workouts.exercises.workout")
    .populate("workout_habit_user_answer_id");

    console.log(result, "result");

    const workoutUserAnswerModelReport = await WorkoutUserAnswerModel.findById(
      result?.workout_habit_user_answer_id
    );

    console.log(workoutUserAnswerModelReport, "workoutAnswerModelReport");

    if (!result) {
      return res.status(404).json({ error: "WorkoutHabit not found" });
    }

    const userReport = await Users.findById(result.user);

    res.json({ data: result, workoutUserAnswerModelReport, user: userReport });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getAllWorkoutHabit(req, res) {
  const branch = req.query?.branch;

  console.log(branch, "branchdsfdsafdsafdsafdsafdsafdsafdsafdsafdsafdsafdsafds");
  try {
    const result = await Workouts.find({ isActive: true }).populate("user");
    console.log(branch, "branch", result);

    res.status(200).json(result);
    // res.status(200).json({success: true});
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}


export async function updateWorkoutHabit(req, res) {
  const id = req.params.id;
  const workoutHabitData = req.body;

  const filter = { $or: [{ user: id }, { _id: id }] };

  try {
  const WorkoutHabitReport = await Workouts.findOne(filter);

  const workoutReport = await WorkoutRoutine.findById(workoutHabitData?.workout_routine_id).populate("workouts").populate({
      path: 'workouts.exercises.workout',
      model: 'Workouts',
    });

  
  
  console.log(workoutReport, WorkoutHabitReport, "WorkoutHabitReport");
  if(workoutReport){   

    const copyData = {
      routineName: workoutReport.routineName,
      difficulty: workoutReport.difficulty,
      days: workoutReport.days,
      workouts: workoutReport?.workouts.map((item) => {
        const copy_item1 = {
            day: item.day,
            dayName: item.dayName,
            exercises: item.exercises.map((item) => {
                const copy_item2 = {
                    workout: item.workout,
                    sets: item.sets,
                    reps: item.reps
                }
                console.log(copy_item2, "copy_item2");
                return copy_item2;
            })
        }

        console.log(copy_item1, "copy_item1");
        return copy_item1;
      } ),
      
      branchName: workoutReport.branchName,
      userId : WorkoutHabitReport.user
    }


    const copy_result = await WorkoutCopyRoutine.create(copyData);

    workoutHabitData.workout_routine_id = copy_result._id;


  
      const result = await Workouts.findOneAndUpdate(filter, workoutHabitData, {
        new: true,
      });
  
      const updateUserData = await Users.findByIdAndUpdate(
        WorkoutHabitReport.user,
        { workout_habit_id: result._id },
        {
          new: true,
        }
      );
     return res.status(200).json({ updateUserData, result });
  }

  res.status(404).json({ error: "Result not Found!" });

  } catch (err) {
    console.log(err, "error");
    res.status(500).send({ error: err.message });
  }
}

// Create a new WorkoutHabitQuestion (POST)
export const createWorkoutHabitQuestion = async (req, res) => {
  const { name, label, field_type, branch } = req.body;

  try {
    const newWorkoutHabitQuestion = new WorkoutQuestionModel({
      name,
      label,
      branch,
      field_type,
    });

    await newWorkoutHabitQuestion.save();
    res.status(201).json(newWorkoutHabitQuestion);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get all WorkoutHabitQuestions (GET)
export const getAllWorkoutHabitQuestions = async (req, res) => {
  const { branch } = req.query;
  const filters = {};
  if (branch) {
    filters.branch = branch;
  }

  console.log(filters, "filters sdsdsd");
  try {
    const all_Workout_habit_questions = await WorkoutQuestionModel.find(filters);

    res.status(200).json(all_Workout_habit_questions);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get WorkoutHabitQuestion by ID (GET)
export const getWorkoutHabitQuestionById = async (req, res) => {
  try {
    const WorkoutHabitReport = await WorkoutQuestionModel.findById(req.params.id);
    if (!WorkoutHabitReport) {
      return res.status(404).json({ message: "WorkoutHabit Question not found" });
    }
    res.status(200).json(WorkoutHabitReport);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Update WorkoutHabitQuestion by ID (PUT)
export const updateWorkoutHabitQuestion = async (req, res) => {
  try {
    const updatedWorkoutHabitQuestion = await WorkoutQuestionModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedWorkoutHabitQuestion) {
      return res.status(404).json({ message: "WorkoutHabitQuestion not found" });
    }

    res.status(200).json(updatedWorkoutHabitQuestion);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Delete WorkoutHabitQuestion by ID (DELETE)
export const deleteWorkoutHabitQuestion = async (req, res) => {
  try {
    const deletedWorkoutHabitQuestion = await WorkoutQuestionModel.findByIdAndDelete(
      req.params.id
    );

    if (!deletedWorkoutHabitQuestion) {
      return res.status(404).json({ message: "WorkoutHabitQuestion not found" });
    }

    res.status(200).json({ message: "WorkoutHabitQuestion deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get WorkoutHabitQuestions by branch (GET)
export const getWorkoutHabitQuestionsByBranch = async (req, res) => {
  const { branch } = req.query;

  console.log(branch, "branchdsfdsafdsafdsafdsafdsafdsafdsafdsafdsafdsafdsafds");

  try {
    const WorkoutHabitQuestions = await WorkoutQuestionModel.find({ branch });
    res.status(200).json(WorkoutHabitQuestions);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};


export async function getAllWorkoutRoutinesBySearch(req, res) {
  const { branch, search } = req.query;

  const query = {
    role: { $ne: "member" },
  };

  if (branch) {
    query.branch = branch;
  }
  try {
    if (search) {
      query.$or = [{ routineName: { $regex: new RegExp(search, "i") } }];

      const result = await WorkoutRoutine.find(query).select({
        routineName: 1,
      });
      res.status(200).json(result);
      return;
    }

    const result = await WorkoutRoutine.find(query)
      .select({
        routineName: 1,
      })
      .sort({ created_at: -1 })
      .limit(6);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

