import connect from '../../../../utils/db';
import Doctor from '../../../models/Doctor';

export async function GET() {
  try {
    await connect();
    const doctors = await Doctor.find();
    return new Response(JSON.stringify(doctors), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connect();
    const doctorData = await request.json();
    const doctor = await Doctor.create(doctorData);
    return new Response(JSON.stringify(doctor), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}