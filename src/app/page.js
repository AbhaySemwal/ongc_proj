'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const Home = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const router = useRouter();
  const [patient, setPatient] = useState({});
  const session = useSession();

  const handleCardClick = (card) => {
    setSelectedCard(card);
    router.push('/appointment?card=' + card);
  };

  const fetchPatientData = async () => {
    if (session.status==='unauthenticated') {
      router.push('/login');
      return;
    }
  };

  useState(() => {
    fetchPatientData();
  }, []);

  if (!session?.data?.user?.name) {
    return <div>Loading...</div>;
  }

  return (
    <div className='py-5 px-5'>
      <p className='font-semibold text-3xl'>Welcome, {session?.data?.user?.name}!</p>
      <div className='py-5'>
        <h2 className='text-2xl'>Select a card:</h2>
        <div className='flex gap-5 py-5'>
          <button onClick={() => handleCardClick('A')} className='text-xl font-semi bold p-10 bg-green-700 rounded-lg'>Card A</button>
          <button onClick={() => handleCardClick('B')} className='text-xl font-semi bold p-10 bg-gray-700 rounded-lg'>Card B</button>
          <button onClick={() => handleCardClick('C')} className='text-xl font-semi bold p-10 bg-blue-700 rounded-lg'>Card C</button>
          <button onClick={() => handleCardClick('D')} className='text-xl font-semi bold p-10 bg-red-700 rounded-lg'>Card D</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
