import mongoose from 'mongoose';

const { Schema } = mongoose;

const doctorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

mongoose.models = {};
export default mongoose.model('Doctor', doctorSchema);