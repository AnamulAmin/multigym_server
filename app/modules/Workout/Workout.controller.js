import Workouts from "./Workout.model.js";

export async function getAllWorkouts(req, res) {
  try {
    const result = await Workouts.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getWorkoutsByFilter(req, res) {
  const { muscle, submuscle, equipment } = req.params;


  // const branch = req.query.branch;

  console.log(muscle, submuscle, equipment, "muscle, submuscle, equipment");

  try {
    let filter = {};

    if (muscle && muscle !== "All") {
      filter.muscle = muscle;
    }

    if (submuscle && submuscle !== "All") {
      filter.submuscle = submuscle;
    }

    if (equipment && equipment !== "All") {
      filter.equipment = equipment;
    }

    // if (branch && branch !== "All") {
    //   filter.branch = branch;
    // }

    const result = await Workouts.find(filter);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getWorkoutById(req, res) {
  const id = req.params.id;
  try {
    const result = await Workouts.findById(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function createWorkout(req, res) {
  try {
    const workoutData = req.body;
    const result = await Workouts.create(workoutData);

    res.status(200).json(result);
  } catch (err) {
    console.error("Error creating workout:", err.message);
    res.status(500).send({ error: err.message });
  }
}

export async function removeWorkout(req, res) {
  const id = req.params.id;
  try {
    const result = await Workouts.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "Data deleted successfully" });
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function updateWorkout(req, res) {
  const id = req.params.id;
  const workoutData = req.body;
  try {
    const result = await Workouts.findByIdAndUpdate(id, workoutData, {
      new: true,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
