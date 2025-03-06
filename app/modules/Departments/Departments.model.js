import mongoose from "mongoose";
const { Schema, model } = mongoose;

const DepartmentsTypeSchema = Schema(
  {
    Role: {
      type: String,
      // required: [true, "Please Add Role"],
    },
    branch: {
      type: String,
      // required: [true, "Please Add Branch"],
    },
  },
  { timestamps: true }
);

const Departments = model("Departments", DepartmentsTypeSchema);

export default Departments;
