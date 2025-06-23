import Sidebar from '../components/SideBar';
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import fetchCurrentUser from '../../utils/fetchCurrentUser';
import axios from 'axios';
import Head from 'next/head';


export default function Library({ currentUser }) {
  const [images, setImages] = useState([]);
  const [user, setUser] = useState(currentUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(true);


     
      useEffect(() => {
        if (!currentUser) {
          const fetchUser = async () => {
            try {
              const res = await fetch('/api/fetchCurrentUser', {
                method: 'GET',
                //credentials: 'include', // ✅ include cookies
                headers: {
                  'Content-Type': 'application/json',
                },
              });
    
              if (res.ok) {
                const data = await res.json();
                setUser(data);
              }else {
                console.warn('User session expired. Redirecting to login...');
              }
            } catch (err) {
              console.error("Client-side fetch user failed:", err);
            }
          };
      
          fetchUser();
        }
      }, [currentUser]); // ✅ This avoids infinite re-renders
      


  // Fetch images once we have a valid user
  useEffect(() => {
    if (!user || !user._id) return;

    const fetchImages = async () => {
      try {
        setLoading(true);
        const res = await axios.post("/api/getImages", { userId: user._id });
        if (res.data.success && res.data.images.length > 0) {
          setImages(res.data.images);
        } else {
          setImages([]);
        }
      } catch (err) {
        console.error("Failed to fetch images:", err);
        setError("Could not load images. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [user]);



  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#ffc1cc] to-[#fceabb]">

    <Head>
     <script src="https://cdn.amplitude.com/libs/analytics-browser-2.11.1-min.js.gz"></script>
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
      </script>
      </Head>






      {/* <div className="w-64">
        <Sidebar currentUser={user} />
      </div> */}



      {/* Desktop Sidebar */}
<div className="hidden sm:block w-64">
  <Sidebar currentUser={user} navVisible={true} />
</div>


      {/* Mobile Top Bar */}
<div className="sm:hidden w-full flex items-center justify-between bg-white/50 backdrop-blur-lg px-4 py-3 shadow-md fixed top-0 left-0 z-50">
  <h1 className="text-xl font-bold text-gray-800">Library</h1>
  <button onClick={() => setShowSidebar(true)} className="text-gray-700 focus:outline-none">
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
</div>


{showSidebar && (
  <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setShowSidebar(false)}>
    <div className="absolute top-0 left-0 w-64 h-full shadow-lg"
     onClick={(e) => e.stopPropagation()}
     >
      <Sidebar currentUser={user} navVisible={true} />
    </div>
  </div>

)}


      <main className="flex-1 p-4 sm:p-8 pt-20 sm:pt-8">
        {/* <h1 className="hidden md:flex text-3xl font-bold mb-4 text-gray-800">Your Library</h1> */}

        {loading ? (
          <p className="text-gray-600 text-lg">Loading images...</p>
        ) : error ? (
          <p className="text-red-600 text-lg">{error}</p>
        ) : images.length === 0 ? (
          <p className="text-gray-600 text-lg">No images yet. Start creating!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((image, idx) => (
              <div key={idx} className="bg-white/40 backdrop-blur-lg p-2 rounded-2xl shadow-xl">
                <img
                  src={image.generatedImageUrl}
                  alt="Generated"
                  className="w-full h-90 object-cover rounded-xl mb-2"
                />
                <button
                  onClick={() => window.open(image.generatedImageUrl, '_blank')}
                  className="mt-2 w-full bg-pink-500 text-white rounded-full py-2 font-semibold shadow hover:bg-pink-600 transition"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const currentUser = await fetchCurrentUser(context.req);

  return {
    props: {
      currentUser: currentUser ? JSON.parse(JSON.stringify(currentUser)) : null,
    },
  };
}

































