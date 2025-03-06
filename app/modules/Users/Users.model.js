import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UsersTypeSchema = Schema(
  {
    full_name: {
      type: String,
      required: [true, "Please Add Name"],
    },
    email: {
      type: String,
      required: [true, "Please Add email"],
    },
    contact_no: {
      type: String,
      // required: [true, "Please Add Contact Number"],
    },
    member_id: {
      type: String,
      // required: [true, "Please Add Contact member id"],
    },
    nickname: {
      type: String,
      // required: [true, "Please Add Nickname"],
    },
    date_of_birth: {
      type: String,
      // required: [true, "Please Add Date of Birth"],
    },
    nid_number: {
      type: String,
      // required: [true, "Please Add Nid Number"],
    },
    address: {
      type: String,
      // required: [true, "Please Add Address"],
    },
    status: {
      type: String,
      // required: [true, "Please Add Address"],
    },
    gender: {
      type: String,
      // required: [true, "Please Select Gender"],

      enum: ["Male", "Female", "Other"],
    },
    religion: {
      type: String,
      // required: [true, "Please Add Religion"],
    },
    blood_group: {
      type: String,
      // required: [true, "Please Add Blood Group"],

      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""],
    },
    height: {
      type: String,
      // required: [true, "Please Add height"],
    },
    weight: {
      type: String,
      // required: [true, "Please Add Weight"],
    },
    profession: {
      type: String,
      // required: [true, "Please Add profession"],
    },
    branch: {
      type: String,
      // required: [true, "Please Add branch"],
    },
    photourl: {
      type: String,
      // required: [true, "Please Add Photo"],
    },
    emergency_contact_name: {
      type: String,
      // required: [true, "Please Add emergency contact name"],
    },
    emergency_contact_number: {
      type: String,
      // required: [true, "Please Add emergency contact Number"],
    },

    progress: {
      type: String,
      // required: [true, "Please Add password"],
    },
    food_habit_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodHabit",
    },
    user_diet_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Diet",
    },
    workout_habit_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workouts",
    },
    fb_id: {
      type: String,
    },
    member_type: {
      type: String,
    },
    card_no: {
      type: String,
      // required: [true, "Please Add Card Number"],
    },
    expiredate: {
      type: String,
      // required: [true, "Please Add Expire Date"],
    },
    role: {
      type: String,
      validate: {
        validator: function (v) {
          return v !== "admin";
        },
        message: "The role 'admin' is not allowed.",
      },
    },
    admission_date: {
      type: String,
      // required: [true, "Please Add Admission Date"],
    },

    notes: {
      type: String,
      // required: [true, "Please Add Notes"],
    },

    Locker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lockers",
    },

    // physicalFitness_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Workouts",
    // },
    // foodRoutine_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Workouts",
    // },
    // packages: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Workouts",
    // },
    otp: {
      type: String,
    },
    tax: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Users = model("User", UsersTypeSchema);

export default Users;
