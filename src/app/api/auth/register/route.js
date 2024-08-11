import bcryptjs from 'bcryptjs';
import connect from '../../../../../utils/db';
import Patient from '@/models/Patient';

export async function POST(request) {
  try {
    await connect();
    const { name, dob, gender, contact, test, cpf, password } = await request.json();
    const hashedPassword=await bcryptjs.hash(password,5);
    const patient = await Patient.create({
      name,
      dob,
      gender,
      contact,
      test,
      cpf,
      password:hashedPassword,
    });
    return new Response(JSON.stringify(patient), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}