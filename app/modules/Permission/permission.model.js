import mongoose from "mongoose";
const { Schema, model } = mongoose;

const permissionSchema = Schema(
  {
    title: { type: String, required: true },
    isAllowed: { type: Boolean, required: true },
    role: { type: String, required: true },
    group_name: { type: String, required: true },
    path: { type: String, required: true },
    branch: { type: String, required: true },
  },

  { timestamps: true }
);

const Permission = model("Permission", permissionSchema);
export default Permission;
