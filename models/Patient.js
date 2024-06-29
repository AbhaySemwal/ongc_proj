import mongoose from "mongoose";

const { Schema } = mongoose;

const patientSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    dob: {
      type: String,
      unique: true,
      required: true,
    },
   gender: {
      type: String,
      required: true,
    },
   contact: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
mongoose.models = {};
export default mongoose.model("Patient", patientSchema);
