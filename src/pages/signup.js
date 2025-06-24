import { useEffect, useState } from 'react'; // Imports the useState hook from React. This hook allows you to add state to your functional components
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from "framer-motion";
import Head from 'next/head';



export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);
  const router = useRouter();



  const handleSubmit = async (e) => { // Declares an asynchronous function named handleSubmit to handle form submission.
    e.preventDefault(); //Prevents the default behavior of the form submission (which is to reload the page).

    setLoading(true);
    const res = await fetch('/api/signup', {   //Uses the Fetch API to send a POST request to the '/api/signup' endpoint.
      method: 'POST',                         // Specifies the HTTP method as POST.
      headers: {                             
        'Content-Type': 'application/json',     //Sets the Content-Type header to application/json, indicating that the request body contains JSON data.
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('User created successfully!');
      router.push({
        pathname: '/PlayGround',
      });
      setLoading(false);
    } else {
      if (data.error === 'User already exists') {
        alert('User already exists.');
        setLoading(false);
      } else {
        alert('Failed to create user.');
        setLoading(false);
      }
    }
  };




//   const handleSubmit = async () => {
//     e.preventDefault(); 
//     // if (password !== confirmPassword) {
//     //   setError('Passwords do not match');
//     //   return;
//     // }

//     setLoading(true);
//     setError('');

//     try {
//       const res = await fetch('/api/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

      
//     if (res.ok) {
//         alert('User created successfully!');
//         router.push({
//           pathname: '/PlayGround',
//         });
//       } else {
//         if (data.error === 'User already exists') {
//           alert('User already exists.');
//         } else {
//           alert('Failed to create user.');
//         }
//       }

   

//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };





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



    <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-white/40 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-4 md:p-10 w-full max-w-md"
    >
    <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-6">Create Your Account</h2>

    {/* {error && (
    <div className="bg-red-100 text-red-700 p-2 text-sm rounded mb-4 text-center">{error}</div>
    )} */}


    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded-xl border border-white/50 bg-white/60 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 rounded-xl border border-white/50 bg-white/60 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />
        <button
          type="submit"
           disabled={loading}
          className="mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-full shadow-lg transition"

        >
          {/* Sign Up */}
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
    </form>


    <p className="text-center text-sm mt-4 text-gray-700">
        Already a user?{' '}
        <Link href="/login" className="text-pink-600 font-semibold hover:underline">
          Login here
        </Link>
      </p>
        </motion.div>

      
    </div>
  );
}















