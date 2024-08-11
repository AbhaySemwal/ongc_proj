'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [contact, setContact] = useState('');
  const [test, setTest] = useState('');
  const [cpfNumber, setCpfNumber] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          dob,
          gender,
          phone:contact,
          test,
          cpf: cpfNumber,
          password,
        }),
      });
      if (response.ok) {
        // Registration successful, redirect to login page
        router.push('/login');
      } else {
        // Handle registration error
        console.error(await response.json());
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
      <h1 className="font-semibold">Register</h1>
      <form className='flex flex-col md:w-[40%] bg-slate-900 p-5 gap-2 my-2' onSubmit={handleRegister}>
        <label htmlFor="name">Name:</label>
        <input
        className="text-white bg-gray-700 px-2 py-1 outline-none"
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="dob">Date of Birth:</label>
        <input
        className="text-white bg-gray-700 px-2 py-1 outline-none"
          type="text"
          id="dob"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <label htmlFor="gender">Gender:</label>
        <input
        className="text-white bg-gray-700 px-2 py-1 outline-none"
          type="text"
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />
        <label htmlFor="contact">Contact:</label>
        <input
        className="text-white bg-gray-700 px-2 py-1 outline-none"
          type="text"
          id="contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        <label htmlFor="test">Test:</label>
        <input
        className="text-white bg-gray-700 px-2 py-1 outline-none"
          type="text"
          id="test"
          value={test}
          onChange={(e) => setTest(e.target.value)}
        />
        <label htmlFor="cpfNumber">CPF Number:</label>
        <input
        className="text-white bg-gray-700 px-2 py-1 outline-none"
          type="text"
          id="cpfNumber"
          value={cpfNumber}
          onChange={(e) => setCpfNumber(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
        className="text-white bg-gray-700 px-2 py-1 outline-none"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='bg-blue-600 px-2 py-1 text-white mt-3' type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;