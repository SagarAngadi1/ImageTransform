// import Sidebar from '../components/SideBar';
// import { useEffect, useState } from "react";
// import { parseCookies } from 'nookies';
// import { useRouter } from 'next/router';
// import fetchCurrentUser from '../../utils/fetchCurrentUser';
// import axios from 'axios'; // Import axios


// export default function Library({ currentUser }) {
//   const [images, setImages] = useState([]);
//   const router = useRouter();
//   const [user, setUser] = useState(currentUser);
  


  
     
//       useEffect(() => {
//         if (!currentUser) {
//           const fetchUser = async () => {
//             try {
//               const res = await fetch('/api/fetchCurrentUser', {
//                 method: 'GET',
//                 //credentials: 'include', // ✅ include cookies
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//               });
    
//               if (res.ok) {
//                 const data = await res.json();
//                 setUser(data);
//               }else {
//                 console.warn('User session expired. Redirecting to login...');
//               }
//             } catch (err) {
//               console.error("Client-side fetch user failed:", err);
//             }
//           };
      
//           fetchUser();
//         }
//       }, [currentUser]); // ✅ This avoids infinite re-renders
      









//   useEffect(() => {
//       if (!user || !user._id) return;
//       const fetchImages = async () => {
//         try {
//           //const userId = localStorage.getItem("userId"); // or get from auth/session
//           const userId = user._id;
//           if (!userId) return;

    
//           const res = await fetch("/api/getImages", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ userId }),
//           });
    
//           const data = await res.json();
    
//            if (data.success && data.images.length > 0){

           
//             //if (data.success && Array.isArray(data.images)) 
//               //if (res.data.success && res.data.images.length > 0)
//            // setImages(data.images);
//             setImages(data.images);
//           } else {
//             // Optional: Leave as empty to fall back to default placeholders
//             setImages([]);
//           }
//         } catch (err) {
//           console.error("Failed to fetch sessions", err);
//         }
//       };
    
//       fetchImages();
//     }, []);







//   return (
//     <div className="min-h-screen flex bg-gradient-to-br from-[#ffc1cc] to-[#fceabb]">
//       <div className="w-64">
//         <Sidebar currentUser={user} />
//       </div>

//       <main className="flex-1 p-8">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Library</h1>

//         {images.length === 0 ? (
//           <p className="text-gray-600 text-lg">No images yet. Start creating!</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {images.map((image, idx) => (
//               <div key={idx} className="bg-white/40 backdrop-blur-lg p-4 rounded-2xl shadow-xl">
//                 <img
//                   //src={img.generatedProductPhotoURL}
//                   src={image.generatedImageUrl}
//                   alt="Generated"
//                   className="w-full h-64 object-cover rounded-xl mb-3"
//                 />
//                 <button
//                   onClick={() => window.open(image.generatedImageUrl, '_blank')}
//                   className="mt-2 w-full bg-pink-500 text-white rounded-full py-2 font-semibold shadow hover:bg-pink-600 transition"
//                 >
//                   View / Download
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }




// export async function getServerSideProps(context) {
//   const currentUser = await fetchCurrentUser(context.req);

//   return {
//     props: {
//       currentUser: currentUser ? JSON.parse(JSON.stringify(currentUser)) : null,
//     },
//   };
// }






















import Sidebar from '../components/SideBar';
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import fetchCurrentUser from '../../utils/fetchCurrentUser';
import axios from 'axios';

export default function Library({ currentUser }) {
  const [images, setImages] = useState([]);
  const [user, setUser] = useState(currentUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch user if not already available from server-side props
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const res = await fetch('/api/fetchCurrentUser');
  //       if (res.ok) {
  //         const data = await res.json();
  //         setUser(data);
  //       } else {
  //         console.warn('User session expired. Redirecting...');
  //         router.push('/login');
  //       }
  //     } catch (err) {
  //       console.error("Client-side fetch user failed:", err);
  //       setError("Failed to fetch user data");
  //     }
  //   };

  //   if (!currentUser) {
  //     fetchUser();
  //   }
  // }, [currentUser]);



  
     
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
      <div className="w-64">
        <Sidebar currentUser={user} />
      </div>

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Your Library</h1>

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

































