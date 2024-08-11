import connect from '../../../../utils/db';
import Appointment from '../../../models/Appointment';

export async function POST(request) {
  try {
    await connect();

    const { patientId, doctorId, date, time, card } = await request.json();
    const latestAppointment = await Appointment.findOne(
      {
        date,
        doctor: doctorId,
      },
      {},
      { sort: { tokenNumber: -1 } }
    );

    let tokenNumber;

    if (latestAppointment) {
      tokenNumber = latestAppointment.tokenNumber + 1;
    } else {
      tokenNumber = 1;
    }
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
    });

    if (existingAppointment) {
      return new Response(
        JSON.stringify({ error: "This time slot is already booked" }),
        { status: 409 }
      );
    }

    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      date,
      time,
      tokenNumber,
      card
    });

    return new Response(JSON.stringify(appointment), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}