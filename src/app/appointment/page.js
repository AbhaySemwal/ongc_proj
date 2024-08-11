'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
const AppointmentPage = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [patient, setPatient] = useState();
  const [doctors, setDoctors] = useState([]);
  const [tokenNumber, setTokenNumber] = useState(null); 
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const card = searchParams.get('card');
  const fetchData = async () => {
    try {
      if (session.status === 'unauthenticated') {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/doctors');
      const doctors = await response.json();
      setPatient(session.data.user);
      setDoctors(doctors);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAppointment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patient.id,
          doctorId: selectedDoctor._id,
          date: appointmentDate,
          time: appointmentTime,
          card,
        }),
      });
      if (response.ok) {
        const data=await response.json();
        setTokenNumber(data.tokenNumber);
      } else {
        console.error(await response.json());
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (!patient || !doctors.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
      <h1 className='font-semibold text-xl'>Book an Appointment</h1>
      <form className='flex flex-col md:w-[40%] bg-slate-900 p-5 gap-2 my-2' onSubmit={handleAppointment}>
        <label htmlFor="doctor">Select a doctor:</label>
        <select
          className='text-white bg-gray-700 px-2 py-1 outline-none'
          id="doctor"
          value={selectedDoctor?._id}
          onChange={(e) =>
            setSelectedDoctor(doctors.find((d) => d._id === e.target.value))
          }
        >
          <option value="">Select a doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor._id} value={doctor._id}>
              {doctor.name}
            </option>
          ))}
        </select>
        <label htmlFor="date">Appointment Date:</label>
        <input
          className='text-white bg-gray-700 px-2 py-1 outline-none'
          type="date"
          id="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
        />
        <label htmlFor="time">Appointment Time:</label>
        <input
          className='text-white bg-gray-700 px-2 py-1 outline-none'
          type="time"
          id="time"
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
        />
        <button className='bg-blue-600 px-2 py-1 text-white mt-2' type="submit">Book Appointment</button>
      </form>
      {tokenNumber && (
        <p className='py-2'>
          Your token number is: <strong>{tokenNumber}</strong>
        </p>
      )}
    </div>
  );
};

export default AppointmentPage;