'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RecaptchaVerifier, PhoneAuthProvider, signInWithPhoneNumber, signInWithCredential } from "firebase/auth";
import { auth } from '../../../utils/firebase';
import { useSession } from 'next-auth/react';

const LoginPage = () => {
  const [cpfNumber, setCpfNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const session = useSession();
  useEffect(() => {
    if (session.status==='authenticated') {
      router.push('/');
      return;
    }
  }, [session]);
  useEffect(() => {
    if (typeof window !== 'undefined' && auth && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response) => {
            handleSendOtp();
          },
          'expired-callback': () => {
            // Reset reCAPTCHA if needed
          },
        },
      );
    }
  }, []);

  const handleSendOtp = async () => {
    const phoneFormatted = `+91${phoneNumber.replace(/\s+/g, '')}`; // Ensuring proper format
  
    if (phoneFormatted.length !== 13) { // +91 followed by 10 digits
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
  
    setLoading(true);
  
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneFormatted, appVerifier);
      setVerificationId(confirmationResult.verificationId);
      alert('OTP has been sent to your phone number.');
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Error sending OTP: ' + error.message);
  
      // Reset reCAPTCHA in case of error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then(function (widgetId) {
          grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!verificationId || !otp) {
      alert('Please request an OTP and enter it.');
      return;
    }
  
    setLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await signInWithCredential(auth, credential);
      
      // User is signed in
      const user = userCredential.user;
      console.log("User signed in:", user);
      
      // Here, you would typically validate the CPF against your backend
      // For now, we'll just check if it's not empty
      if (cpfNumber.trim() === '') {
        throw new Error('CPF number is required');
      }

      // If everything is okay, redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error during login:', error);
      alert('Error during login: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
      <h1 className="font-semibold">Login with OTP</h1>
      <form className='flex flex-col bg-slate-900 p-5 gap-2 my-2' onSubmit={handleLogin}>
        <label htmlFor="cpfNumber">CPF Number:</label>
        <input
          className="text-white bg-gray-700 px-2 py-1 outline-none"
          type="text"
          id="cpfNumber"
          value={cpfNumber}
          onChange={(e) => setCpfNumber(e.target.value)}
          required
        />

        <label htmlFor="phoneNumber">Phone Number :</label>
        <input
          className="text-white bg-gray-700 px-2 py-1 outline-none"
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <div id="recaptcha-container"></div>
        <button className="bg-blue-600 px-2 py-1 text-white mt-2" type="button" onClick={handleSendOtp} disabled={loading}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>

        {verificationId && (
          <>
            <label htmlFor="otp">Enter OTP:</label>
            <input
              className="text-white bg-gray-700 px-2 py-1 outline-none"
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP & Login'}
            </button>
          </>
        )}
      </form>
      <p>
        Don't have an account? <Link href="/register">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;