// pages/login.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from "framer-motion";
import Link from 'next/link';
import Head from 'next/head';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const router = useRouter();



  const handleLogin = async (event) => {
    event.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Log in successful');
      router.push('/PlayGround');
      window.location.href = '/PlayGround';  //Probably we need to comment this out, because after login and when the user reahces, payground page is refreshing
    } else {
      alert(data.error === 'User does not exists' ? 'User does not exist' : 'Failed to login.');
    }
  };

 

  const handleForgotPassword = async () => {
    const res = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: resetEmail }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Verification successful. Enter new password.');
      setResetSuccess(true);
    } else {
      alert(data.error || 'User not found.');
    }
  };

  const handleResetPassword = async () => {
    const res = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: resetEmail, newPassword }),
    });

    if (res.ok) {
      alert('Password reset successful!');
      setIsForgotPassword(false);
      setResetSuccess(false);
    } else {
      alert('Failed to reset password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ffc1cc] to-[#fceabb] p-4 md:p-0">
     
     <Head>
     {/* <script src="https://cdn.amplitude.com/libs/analytics-browser-2.11.1-min.js.gz"></script>
      <script src="https://cdn.amplitude.com/libs/plugin-session-replay-browser-1.8.0-min.js.gz"></script>
      <script>
         {`
          window.amplitude.add(window.sessionReplay.plugin({ sampleRate: 1 }));
          window.amplitude.init('28c28af38ad4cd334bed1c7f7b9631ff', {
          autocapture: {
          elementInteractions: true
           }
         });
        `}
      </script> */}
      </Head>
    

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-white/40 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-4 md:p-10 w-full max-w-md"
      >
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-6">Log In</h2>

        {!isForgotPassword && (
          <form onSubmit={handleLogin} className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded-xl border border-white/50 bg-white/60 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded-xl border border-white/50 bg-white/60 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700"
              required
            />
            <button
              type="submit"
              className="mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-full shadow-lg transition"
            >
              Log In
            </button>
          </form>
        )}

        {isForgotPassword && !resetSuccess && (
          <div className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="p-3 rounded-xl border bg-white text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              onClick={handleForgotPassword}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl"
            >
              Verify Email
            </button>
          </div>
        )}

        {resetSuccess && (
          <div className="flex flex-col space-y-4 mt-4">
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="p-3 rounded-xl border bg-white text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              onClick={handleResetPassword}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl"
            >
              Reset Password
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm">
            New to Space?{' '}
            <Link href="/signup" className="text-pink-600 font-semibold hover:underline">
              Sign up!
            </Link>
          </p>
          <button
            onClick={() => {
              setIsForgotPassword(!isForgotPassword);
              setResetSuccess(false);
            }}
            className="mt-4 text-sm text-blue-400 hover:text-blue-600 underline"
          >
            {isForgotPassword ? 'Back to Login' : 'Forgot Password?'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
