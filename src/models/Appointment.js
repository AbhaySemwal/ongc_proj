import mongoose from 'mongoose';

const { Schema } = mongoose;

const appointmentSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    card: {
      type: String,
      required: true,
    },  
    tokenNumber: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

mongoose.models = {};
export default mongoose.model('Appointment', appointmentSchema);