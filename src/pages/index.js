import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import fetchCurrentUser from '../../utils/fetchCurrentUser';
import axios from 'axios'; // Add this line if missing
import Head from 'next/head';







const styles = [
  { label: 'GTA 6 Game', image: 'gta6.jpg' },
  { label: 'Lego', image: 'lego.jpg' },
  { label: 'Pixar', image: 'pixar.jpg' },
  { label: 'Cyberpunk', image: 'cyberpunk.jpg' },
 



];


export default function Home({ currentUser }) {
  const router = useRouter();
  const [navVisible, setNavVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState(currentUser);
  const [selectedStyle, setSelectedStyle] = useState('');

  const pricingSectionRef = useRef(null);

  const scrollToPricing = () => {
    if (pricingSectionRef.current) {
      pricingSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (router.query.scrollToPricing === 'true' && pricingSectionRef.current) {
      pricingSectionRef.current.scrollIntoView({ behavior: 'smooth' });

      const { pathname } = router;
      router.replace(pathname, undefined, { shallow: true });
    }
  }, [router.query]);






  // Example images for Image Transform feature
  const slides = [
     {
      original: 'EinstienReal.png',
      transformed: 'anime.jpg',
    },
    {
      original: 'walking.png',
      transformed: 'walking_transformed.png',
    },
    {
      original: 'jhonwick.png',
      transformed: 'jhonwickcyberpunk.jpg',
    },
    {
      original: 'couple.png',
      transformed: 'couplefantasy.jpg',
    },
  ];



  

  // Example styles for Scenario Builder
  const scenarioSlides = [
    {
      baseImage: 'person1.png',
      styleApplied: 'fantasyBackground.png',
      quote: 'Believe in yourself.',
    },
    {
      baseImage: 'person2.png',
      styleApplied: 'futureCity.png',
      quote: 'Dream bigger!',
    },
    {
      baseImage: 'person3.png',
      styleApplied: 'natureScene.png',
      quote: 'Stay grounded.',
    },
  ];

  const [currentScenarioSlide, setCurrentScenarioSlide] = useState(0);




     
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
  


  


  useEffect(() => {
    const timeout = setTimeout(() => setNavVisible(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScenarioSlide((prev) => (prev + 1) % scenarioSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [scenarioSlides.length]);



  useEffect(() => {
    const container = document.getElementById('scenario-scroll');
  
    const onWheel = (e) => {
      if (container) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };
  
    if (container) {
      container.addEventListener('wheel', onWheel);
    }
  
    return () => {
      if (container) {
        container.removeEventListener('wheel', onWheel);
      }
    };
  }, []);




   useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);



  // Function to start checkout process for a specific product
  const handlePayment = async (planId) => {

  
    if (!user) {
      // Redirect to signup if the user is not logged in
      router.push('/signup');
      return;
    }

    try {
      const userId = user._id
      //const response = await axios.post('/api/payments', { userId });
      const response = await axios.post('/api/payments', { planId, userId });

      const { orderId, key, credits } = response.data;

      
      // Load the Razorpay checkout script
      const options = {
        key, // Razorpay Key
        amount: response.data.amount,
        currency: 'USD',
        name: 'ImageTransform - Payment',
        description: 'Choose your plan',
        order_id: orderId,

       // Credits: response.data.Credits, //added now

        handler: async function (response) {
          // Handle the successful payment response here
          alert('Payment Success: ' + response.razorpay_payment_id);

          // Call the updateUserCredits API to update the credits after successful payment
          try {

            await axios.post('/api/updateUserCredits', {
             userId,
             credits, // The credits for the selected plan
           });
          
          // Redirect to CreateProductPhoto page after updating credits
           router.push('/PlayGround');

          } catch (updateError) {
            console.error('Error updating credits:', updateError);
            alert('Error updating credits. Please contact support.');
          }

        

        },
        prefill: {
          email: user.email, // You can fill these from the user's data
          //email: 'john.doe@example.com',
          //contact: '9999999999'
        },
        theme: {
          color: '#3399cc'
        }
      };

    const razorpay = new window.Razorpay(options);
    razorpay.open();

    } catch (error) {
      console.error('Payment Error:', error);
      alert('Failed to start payment process.');
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffc1cc] to-[#fceabb] flex flex-col items-center justify-center relative overflow-hidden">


    <Head>
      {/* <title>A New Virtual Shopping Experience - DressUp AI</title>
        <meta name="description" content="Virtual Try-On for Everyone – Style Yourself or Your Brand Effortlessly" />
        <meta name="keywords" content="Dress, Fashion, AI Fashion, Virtual Try-On, Clothing Brand, Clothing Business, DressUp AI" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/logo.png" />
        <meta name="author" content="DressUp AI" />
        */}
       
        {/* Open Graph (OG) meta tags for social sharing */}
      {/* <meta property="og:title" content="DressUp AI - A New Virtual Shopping Experience" />
      <meta property="og:description" content="Virtual Try-On for Everyone – Style Yourself or Your Brand Effortlessly" />
      <meta property="og:image" content="https://dressupai.onrender.com/logo.png" />
      <meta property="og:url" content="https://dressupai.onrender.com/" />
      <meta property="og:type" content="website" /> */}

      {/* Twitter Card meta tags for social sharing */}
      {/* <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="DressUp AI - Virtual Try-On for Everyone – Style Yourself or Your Brand Effortlessly" />
      <meta name="twitter:description" content="No more guessing how clothes will look on you, skip the dressing rooms and shop with confidence. Try multiple outfits from the comfort of your home." />
      <meta name="twitter:image" content="https://dressupai.onrender.com/logo.png" /> */}

      {/* Structured Data (JSON-LD) for SEO */}
      {/* <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "DressUp AI - A New Virtual Shopping Experience",
            "image": "https://dressupai.onrender.com/logo.png",
            "description": "DressUp AI - Virtual Try-On for Everyone – Style Yourself or Your Brand Effortlessly",
            "brand": "DressUp AI",
            "offers": {
              "@type": "Offer",
              "url": "https://dressupai.onrender.com/",
              "priceCurrency": "USD",
              "price": "19",
              "availability": "https://schema.org/InStock"
            }
          })}
      </script> */}


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












      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={navVisible ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-10 z-50 bg-white/60 backdrop-blur-lg border border-white/50 rounded-full shadow-md
           px-2 py-2 md:px-8 md:py-3 text-sm md:text-base flex flex-wrap gap-4 sm:gap-6 md:gap-8 text-pink-700 text-md font-semibold tracking-wide"
           
          //px-4 py-2 md:px-8 md:py-3 flex gap:4 sm:gap-6 md:gap-8 text-pink-700 text-sm sm:text-md font-semibold tracking-wide"

      >
      {user ? null : (
       <>
      {/* Show only if user not logged in */}
        <button onClick={() => router.push('/signup')} className="hover:text-pink-500 text-gray-700 transition-all">
          SignUp
        </button>

        <button onClick={() => router.push('/login')} className="hover:text-pink-500 text-gray-700 transition-all">
          LogIn
        </button>
       </>
      )}

        <button 
        onClick={scrollToPricing}
       // onClick={() => router.push('/#pricing')}
        className="hover:text-pink-500 text-gray-700 transition-all">
          Pricing
        </button>

       

        {/* <button onClick={() => router.push('/feed')} className="hover:text-pink-500 text-gray-700 transition-all">
          ArtVerse
        </button> */}

        <button onClick={() => router.push('/PlayGround')} className="hover:text-pink-500 text-gray-700 transition-all">
          PlayGround
        </button>
      </motion.nav>





      {/* MAIN CONTENT */}
      <main 
      //className="flex-1 w-full flex flex-col items-center justify-center p-10 pt-28 gap-16"
      className="flex-1 w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 pt-24 sm:pt-28 gap-12"
      >
        
        {/* IMAGE TRANSFORM SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl w-full mt-12 md:mt-24 bg-white/40 backdrop-blur-lg p-6 md:p-12 rounded-3xl shadow-2xl text-center border border-white/20"
        >


          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-6 tracking-tight drop-shadow-md">
            Transform Your Images ✨
            {/* Transform Your Images 5xl ✨ */}
          </h1>


          <p className="text-base md:text-lg text-gray-600 mb-8">
            Upload your photo and get magical styles like Ghibli, Lego, Pixar, Anime, and more!
          </p>

          {/* Slideshow */}
          <div className="w-full rounded-2xl p-3 md:p-8 flex flex-col items-center gap-6">
            <div className="grid grid-cols-2 gap-6 md:gap-8">
              {/* Original Image */}
              <div className="flex flex-col items-center">
                <p className="mb-2 text-gray-700 font-semibold text-sm md:text-lg">Original Image</p>
                <div className="overflow-hidden rounded-2xl shadow-md border border-white/30">
                  <img 
                    src={slides[currentSlide].original} 
                    alt="Original" 
                    className="object-cover w-50 h-40 md:w-84 md:h-84" 
                    //className="object-cover w-40 h-30"
                  />
                </div>
              </div>

              {/* Transformed Image */}
              <div className="flex flex-col items-center">
                <p className="mb-2 text-gray-700 font-semibold text-sm md:text-lg">Style Transform</p>
                <div className="overflow-hidden rounded-2xl shadow-md border border-white/30">
                  <img 
                    src={slides[currentSlide].transformed} 
                    alt="Transformed" 
                    className="object-cover w-50 h-40 md:w-84 md:h-84" 

                    //className="object-cover w-84 h-84"

                  />
                </div>
              </div>
            </div>
          </div>
        </motion.section>


        

{/* SCENARIO BUILDER SECTION */}
<motion.section
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="max-w-7xl w-full bg-white/40 backdrop-blur-lg p-6 md:p-12 rounded-3xl shadow-2xl text-center border border-white/20 overflow-hidden"
>

  <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-6 tracking-tight drop-shadow-md">
    Scene Builder
  </h2>
  <p className="text-base md:text-lg text-gray-600 mb-8">
    Craft a scene with your photo, select styles, add quotes, and see the magic unfold!
  </p>

  <div
    id="scenario-scroll"
    className="flex overflow-x-auto space-x-8 snap-x snap-mandatory no-scrollbar px-2 py-4"
    style={{ scrollBehavior: 'smooth' }}
  >
    {/* STEP 1: Base Image */}
    

    <div className="snap-start flex-shrink-0 w-[300px] flex flex-col gap-4 items-center rounded-2xl">
      <p className="text-pink-600 font-semibold text-base">Step 1: Base Image</p>

      <div className="overflow-hidden rounded-xl border border-white/30 w-64 h-64 flex items-center justify-center shadow-md">
        <img
          src="jhonwick.png"
          alt="Base Image"
          className="object-cover w-full h-full"
         // className="object-cover w-50 h-40 md:w-full md:h-full"

        />
      </div>
    </div>

           

    {/* STEP 2: Select Style */}
    <div className="snap-start flex-shrink-0 w-[300px] flex flex-col gap-4 items-center rounded-2xl">
      <p className="text-pink-600 font-semibold text-base">Step 2: Select Style</p>
      <div className="grid grid-cols-2 gap-3">
      

        <>
        {styles.map(({ label, image }) => (
       
        <div
          key={label}
          onClick={() => setSelectedStyle(label)}
          className={`relative cursor-pointer rounded-2xl overflow-hidden shadow-lg border-4 transition-all duration-200 ${
            selectedStyle === label ? 'border-pink-500 scale-105' : 'border-transparent hover:border-pink-300'
          }`}
        >
          <img src={image} alt={label} className="w-30 h-30 object-cover" />

          <div className="absolute bottom-0 w-full bg-black/60 text-white text-center py-0 text-sm">
            {label}
          </div>
        </div>



      ))}
  </>










      </div>



    </div>



    {/* STEP 3: Add Quote */}
    <div className="snap-start flex-shrink-0 w-[300px] flex flex-col gap-4 items-center rounded-2xl">
      <p className="text-pink-600 font-semibold text-md">Step 3: Add Quote</p>
      <div className="w-64 h-64 border-2 border-dashed border-pink-400 rounded-xl flex items-center justify-center bg-white/50 px-4 text-center shadow-md">
        <p className="text-gray-700 font-medium italic text-lg leading-relaxed">
          “It&apos;s not over until I win”
        </p>
      </div>
    </div>





    {/* STEP 4: Final Preview */}
    <div className="snap-start flex-shrink-0 w-[300px] flex flex-col gap-4 items-center rounded-2xl">
    {/* <div className="snap-start flex-shrink-0 w-[300px] flex flex-col gap-4 items-center bg-white/30 p-4 rounded-2xl shadow-lg border border-white/20"> */}

      <p className="text-pink-600 font-semibold text-md">Step 4: Final Preview</p>
      <div className="overflow-hidden rounded-xl border border-white/30 w-64 h-64 flex items-center justify-center shadow-md">
        <img
          src="johnwickscene.jpg"
          alt="Final Preview"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  </div>
</motion.section>




{/* PRICING SECTION */}
<section ref={pricingSectionRef} className="max-w-7xl w-full bg-white/40 backdrop-blur-lg p-12 rounded-3xl shadow-2xl text-center border border-white/20 mt-12">
  <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-6 tracking-tight drop-shadow-md">
    Pricing Plans 💸
  </h2>
  <p className="text-base md:text-lg text-gray-600 mb-10">
    Choose the plan that fits your creativity needs best.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
    {/* Basic PLAN */}
    
    <div className="bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl flex flex-col items-center hover:scale-105 transition-transform duration-300">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Basic</h3>
      <p className="text-pink-600 text-3xl font-extrabold mb-4">$9</p>
      <p className="text-gray-700 mb-6">100 image generations</p>
      <button
      //onClick={handlePayment}
      onClick={() => handlePayment('basic')}
      className="bg-pink-600 text-white px-3 md:px-6 py-2 rounded-full shadow hover:bg-pink-700 transition duration-300">
        Get Started
      </button>
    </div>

    {/* PRO PLAN */}
    <div className="bg-white/50 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-2xl flex flex-col items-center scale-105 ring-2 ring-pink-400">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Pro</h3>
      <p className="text-pink-600 text-3xl font-extrabold mb-4">$19</p>
      <p className="text-gray-700 mb-6">200 image generations</p>
      <button
      onClick={() => handlePayment('pro')}

       className="bg-pink-600 text-white px-6 py-2 rounded-full shadow hover:bg-pink-700 transition duration-300">
       Go Pro
      </button>
    </div>

    {/* ULTRA PLAN */}
    <div className="bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl flex flex-col items-center hover:scale-105 transition-transform duration-300">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Ultra</h3>
      <p className="text-pink-600 text-3xl font-extrabold mb-4">$29</p>
      <p className="text-gray-700 mb-6">300 image generations</p>
      <button 
      onClick={() => handlePayment('ultra')}
      
      className="bg-pink-600 text-white px-6 py-2 rounded-full shadow hover:bg-pink-700 transition duration-300">
        Go Ultra
      </button>
    </div>
  </div>











</section>


  {/* FOOTER */}
<footer className="max-w-7xl w-full bg-white/40 backdrop-blur-lg p-12 rounded-3xl shadow-2xl text-center border border-white/20 mt-12">
  <div className="text-gray-700 text-sm">
    © {new Date().getFullYear()} ImageTransform. All rights reserved.
  </div>
  <div className="text-pink-700 text-sm mt-1">
    Contact: <a href="mailto:support@imagetransform.app" className="underline hover:text-pink-500">ianassagar@gmail.com</a>
  </div>
</footer>





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














































// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { motion } from 'framer-motion';
// import fetchCurrentUser from '../../utils/fetchCurrentUser';
// import Sidebar from '../components/SideBar';


// export default function Home({ currentUser }) {
//   const router = useRouter();
//   const [navVisible, setNavVisible] = useState(false);
//   const [user, setUser] = useState(currentUser);
//   const [posts, setPosts] = useState([]);
//   const [trendingPosts, setTrendingPosts] = useState([]);
//   const [view, setView] = useState('foryou'); // 'foryou' | 'trending'
//   const [activeTab, setActiveTab] = useState('For You');


//   const profileImages = {
//   sagar_angadi: 'exercise.png',
//   techie_girl: 'meditate.png',
//   default: 'walking.png',
//   };


//   const timeAgo = (hours) => {
//   if (hours < 1) return 'Just now';
//   if (hours === 1) return '1 hour ago';
//   return `${hours} hours ago`;
//   };


//   useEffect(() => {
//     const fetchUserIfNeeded = async () => {
//       if (!currentUser) {
//         try {
//           const res = await fetch('/api/fetchCurrentUser');
//           if (res.ok) {
//             const data = await res.json();
//             setUser(data);
//           }
//         } catch (err) {
//           console.error("Fetch user error", err);
//         }
//       }
//     };

//     fetchUserIfNeeded();
//     setNavVisible(true);
//   }, []);

//   useEffect(() => {
//     // Dummy posts
//     const dummyPosts = [
//       {
//         id: 1,
//         user: 'sagar_angadi',
//         content: 'Just styled this with AI ✨',
//         image: 'creativewriting.png',
//         reactions: { '❤️': 4, '🔥': 2 },
//       },
//       {
//         id: 2,
//         user: 'techie_girl',
//         content: 'My dream scene built with Scenario Builder 🌄',
//         image: 'fantasyBackground.png',
//         reactions: { '💡': 3, '❤️': 1 },
//       },
//     ];

//     setPosts(dummyPosts);
//     setTrendingPosts(dummyPosts.slice(0, 1));
//   }, []);

//   const addReaction = (postId, emoji) => {
//     const target = view === 'trending' ? trendingPosts : posts;
//     const setTarget = view === 'trending' ? setTrendingPosts : setPosts;

//     setTarget(prev =>
//       prev.map(p =>
//         p.id === postId
//           ? {
//               ...p,
//               reactions: {
//                 ...p.reactions,
//                 [emoji]: (p.reactions[emoji] || 0) + 1,
//               },
//             }
//           : p
//       )
//     );
//   };




//   return (




//   <div className="min-h-screen bg-gradient-to-br from-[#ffc1cc] to-[#fceabb] flex items-start justify-center gap-35">
//   {/* LEFT SIDEBAR */}
//   <div className="w-64">
//     <Sidebar currentUser={user} />
//   </div>

//   {/* CENTER FEED */}
//   <div className="flex-1 max-w-2xl flex flex-col gap-4 mt-6">
//     {/* FEED HEADER */}
//     {/* <h1 className="text-center text-3xl font-bold text-pink-600 drop-shadow-sm">Creator Feed</h1> */}

//     {/* TOGGLE TABS */}
//     <div className="w-full flex justify-center">
//       <div className="w-full bg-white/50 backdrop-blur-md border border-white/40 rounded-full p-1 flex justify-between">
//         {['For You', 'Trending'].map(option => (
//           <button
//             key={option}
//             onClick={() => setActiveTab(option)}
//             className={`flex-1 text-center px-4 py-2 rounded-full font-semibold transition-all ${
//               activeTab === option ? 'bg-pink-500 text-white shadow' : 'text-gray-700'
//             }`}
//           >
//             {option}
//           </button>
//         ))}
//       </div>
//     </div>

//     {/* POSTS */}
//     {activeTab === 'Trending' ? (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-lg"
//       >
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">🔥 Trending Posts</h2>
//         <div className="flex flex-col gap-4">
//           {trendingPosts.map(post => (
//             <div key={post.id} className="bg-white/60 rounded-xl p-4 shadow-md border border-white/30">
//               <p className="text-gray-700 font-semibold">@{post.user}</p>
//               <p className="text-gray-600">{post.content}</p>
//             </div>
//           ))}
//         </div>
//       </motion.div>
//     ) : (
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1 }}
//         className="flex flex-col gap-6"
//       >
//         {posts.map(post => (
//           <div
//             key={post.id}
//             className="bg-white/40 backdrop-blur-lg p-6 rounded-3xl shadow-md border border-white/30"
//           >
//             <div className="flex items-center gap-4 mb-4">
//               <img
//                 src={profileImages[post.user] || profileImages.default}
//                 alt="Profile"
//                 className="w-10 h-10 rounded-full border border-white/60 object-cover"
//               />
//               <div>
//                 <p className="font-semibold text-pink-600">@{post.user}</p>
//                 <p className="text-sm text-gray-500">{timeAgo(post.hoursAgo)}</p>
//               </div>
//             </div>

//             <p className="text-gray-700 mb-4">{post.content}</p>
//             {post.image && (
//               <img
//                 src={post.image}
//                 alt="Post"
//                 className="rounded-xl border border-white/20 mb-4 w-full max-h-96 object-cover"
//               />
//             )}

//             <div className="flex gap-3 flex-wrap mt-2">
//               {['❤️', '🔥', '💡', '😂'].map(emoji => (
//                 <button
//                   key={emoji}
//                   onClick={() => addReaction(post.id, emoji)}
//                   className="flex items-center gap-1 px-3 py-1 bg-white/80 text-lg rounded-full border border-gray-300 shadow-sm hover:scale-105 hover:bg-white transition-all duration-200"
//                 >
//                   {emoji} <span className="text-sm">{post.reactions[emoji] || 0}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         ))}
//       </motion.div>
//     )}
//   </div>

//   {/* RIGHT SIDEBAR: MOST ACTIVE USERS */}
//   <div className="w-64 hidden lg:block mt-6">
//     <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-4 border border-white/30 shadow-md">
//       <h2 className="text-xl font-extrabold text-gray-700 mb-4 tracking-tight">Active Users</h2>
//       <div className="flex flex-col gap-4">
//         {[
//           { username: 'sagar_angadi', image: profileImages.sagar_angadi },
//           { username: 'techie_girl', image: profileImages.techie_girl },
//           { username: 'creative_mind', image: profileImages.default },
//         ].map(user => (
          
//         <div key={user.username} className="flex items-center gap-3">
//            <img
//            src={user.image}
//            alt={user.username}
//            className="w-10 h-10 rounded-full border border-white object-cover"
//           />
//           <div className="flex flex-col">
//              <p className="font-semibold text-pink-600">@{user.username}</p>
//              <p className="text-sm text-gray-600">{user.postCount} Posts</p>
//           </div>
//         </div>




//         ))}
//       </div>
//     </div>
//   </div>
// </div>

// );

// }

// export async function getServerSideProps(context) {
//   const currentUser = await fetchCurrentUser(context.req);
//   return {
//     props: {
//       currentUser: currentUser ? JSON.parse(JSON.stringify(currentUser)) : null,
//     },
//   };
// }
































































































































































































// import { motion } from "framer-motion";
// import { FaCloudUploadAlt, FaLeaf, FaMagic } from "react-icons/fa";

// export default function LandingPage() {
//   return (
//     <div className="flex flex-col">
      
//       {/* Hero Section */}
//   <section
//   className="min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden"
//   style={{
//     background: "linear-gradient(to bottom, #a1c4fd 0%, #c2e9fb 40%, #d4fc79 70%, #96e6a1 100%)",
//   }}
// >
//   {/* Animated Clouds */}
//   <motion.div
//     animate={{ y: [0, 20, 0] }}
//     transition={{ duration: 10, repeat: Infinity }}
//     className="absolute top-10 left-10 w-32 h-32 bg-white opacity-20 rounded-full blur-3xl"
//   />
//   <motion.div
//     animate={{ y: [0, -20, 0] }}
//     transition={{ duration: 8, repeat: Infinity }}
//     className="absolute bottom-20 right-10 w-24 h-24 bg-white opacity-20 rounded-full blur-2xl"
//   />

//   {/* Hero Content */}
//   <motion.h1 
//     initial={{ opacity: 0, y: -30 }} 
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 1 }}
//     className="text-5xl md:text-6xl font-bold text-gray-800 drop-shadow-md"
//   >
//     Transform Your Photos into Nature’s Magic
//   </motion.h1>

//   <motion.p 
//     initial={{ opacity: 0, y: 30 }} 
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 1, delay: 0.5 }}
//     className="text-xl text-gray-700 mt-6 max-w-2xl"
//   >
//     A magical experience where the sky meets the earth. Upload your image and feel the nature breathe into it!
//   </motion.p>

//   {/* Upload Button */}
//   <motion.button
//     whileHover={{ scale: 1.05 }}
//     whileTap={{ scale: 0.95 }}
//     className="mt-10 bg-white text-blue-500 px-6 py-3 rounded-full font-semibold shadow-xl flex items-center gap-2"
//   >
//     <FaCloudUploadAlt size={24} />
//     Upload Your Image
//   </motion.button>

// </section>



//       {/* Upload Section */}
//       <section className="min-h-screen bg-gradient-to-br from-[#d4fc79] to-[#96e6a1] flex flex-col items-center justify-center text-center p-8">
//         <motion.h2 
//           initial={{ opacity: 0, y: 30 }} 
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-4xl font-bold text-gray-800 mb-6"
//         >
//           Easy Upload & Style
//         </motion.h2>

//         {/* Upload UI */}
//         <motion.div 
//           whileHover={{ scale: 1.02 }}
//           className="bg-white rounded-3xl p-8 shadow-xl w-full max-w-md"
//         >
//           <p className="text-gray-600 mb-4">Drag & Drop your image here</p>
//           <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12">
//             <FaCloudUploadAlt size={48} className="text-green-400 mx-auto mb-4" />
//             <p className="text-gray-500">Or click to browse</p>
//           </div>
//         </motion.div>
//       </section>

//       {/* How It Works */}
//       <section className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-10">
//         <motion.h2 
//           initial={{ opacity: 0, y: 30 }} 
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-4xl font-bold text-gray-800 mb-12"
//         >
//           How It Works
//         </motion.h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
//           {[
//             { icon: FaCloudUploadAlt, text: "Upload your photo" },
//             { icon: FaMagic, text: "Choose your style" },
//             { icon: FaLeaf, text: "Get your nature-transformed image!" },
//           ].map((step, index) => (
//             <motion.div 
//               key={index}
//               whileHover={{ scale: 1.05 }}
//               className="flex flex-col items-center p-6 bg-gradient-to-br from-[#c2e9fb] to-[#a1c4fd] rounded-3xl shadow-lg"
//             >
//               <step.icon size={48} className="text-white mb-4" />
//               <p className="text-white font-semibold">{step.text}</p>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gradient-to-br from-[#d4fc79] to-[#96e6a1] text-center p-6">
//         <p className="text-gray-800">© 2025 NatureTransform | All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }
