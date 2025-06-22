// import { useRouter } from 'next/router';
// import { motion } from 'framer-motion';
// import { useEffect, useState } from 'react';
// import { Home, Image, BookOpen, Heart, User, LogIn, SignatureIcon } from 'lucide-react';
// //import fetchCurrentUser from '../../utils/fetchCurrentUser';
// import { parseCookies } from 'nookies';
// import Signup from '@/pages/signup';



// export default function Sidebar({ currentUser }) {
//   const router = useRouter();
//   const [navVisible, setNavVisible] = useState(false);
//   //const [user, setUser] = useState(currentUser);


  
   






//   useEffect(() => {
//     const timeout = setTimeout(() => setNavVisible(true), 300);
//     return () => clearTimeout(timeout);
//   }, []);

//   const navItems = [
//     { label: 'Home', path: '/', icon: <Home size={18} /> },
//     { label: 'PlayGround', path: '/PlayGround', icon: <Image size={18} /> },
//     { label: 'Library', path: '/Library', icon: <BookOpen size={18} /> },
//     { label: 'Favourites', path: '/favourites', icon: <Heart size={18} /> },

//     //Added the below two now
//     { label: 'Log In', path: '/login', icon: <LogIn size={18} /> },
//     { label: 'Sign Un', path: '/signup', icon: <SignatureIcon size={18} /> },


//   ];

//   const isActive = (path) => router.pathname === path;

//   return (
//     <motion.aside
//       initial={{ x: -100, opacity: 0 }}
//       animate={navVisible ? { x: 0, opacity: 1 } : {}}
//       transition={{ duration: 0.6, ease: 'easeOut' }}
//       className="fixed top-0 left-0 h-full w-64 bg-white/40 backdrop-blur-xl border-r border-white/30 shadow-2xl px-6 py-8 flex flex-col justify-between z-40"
//     >
//       <div>
//         <h2 className="text-3xl font-extrabold text-gray-800 mb-10 tracking-tight">DashBoard</h2>

//         <nav className="flex flex-col gap-2 text-[17px] font-medium text-gray-700">
//           {navItems.map((item) => (
//             <div
//               key={item.label}
//               onClick={() => router.push(item.path)}
//               className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl transition-all duration-200
//                 ${
//                   isActive(item.path)
//                     ? 'bg-white/50 text-pink-600 border-l-4 border-pink-500 shadow-inner'
//                     : 'hover:bg-white/60 hover:text-pink-600'
//                 }
//               `}
//             >
//               {item.icon}
//               <span>{item.label}</span>
//             </div>
//           ))}
//         </nav>
//       </div>

//       <div
//         onClick={() => router.push('/profile')}
//         className={`flex items-center gap-3 px-0 py-3 cursor-pointer rounded-xl transition-all duration-200
//           ${
//             isActive('/profile')
//               ? 'bg-white/70 text-pink-600 border-l-4 border-pink-500 shadow-inner'
//               : 'hover:bg-white/60 hover:text-pink-600'
//           }
//         `}
//       >
//         <User size={18} />
//         <span className="text-sm text-gray-700 font-medium">{currentUser?.email ?? "user@example.com"}</span>
//       </div>
      


//     </motion.aside>
//   );
// }
















import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  Home,
  Image,
  BookOpen,
  Heart,
  User,
  LogIn,
  SignatureIcon,
  Settings,
} from 'lucide-react';

export default function Sidebar({ currentUser }) {
  const router = useRouter();
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setNavVisible(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  const navItems = [
    { label: 'Home', path: '/', icon: <Home size={20} /> },
    { label: 'PlayGround', path: '/PlayGround', icon: <Image size={20} /> },
    { label: 'Library', path: '/Library', icon: <BookOpen size={20} /> },
   // { label: 'Favourites', path: '/favourites', icon: <Heart size={20} /> },
    { label: 'Log In', path: '/login', icon: <LogIn size={20} /> },
    { label: 'Sign Up', path: '/signup', icon: <SignatureIcon size={20} /> },
  ];

  const isActive = (path) => router.pathname === path;

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={navVisible ? { x: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      //className="flex sm:flex fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-lg border-r border-white/30 shadow-2xl px-6 py-8 flex-col justify-between z-40"
      className={`${
  navVisible ? 'flex' : 'hidden'
} sm:flex fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-lg border-r border-white/30 shadow-2xl px-6 py-8 flex-col justify-between z-40`}

    >
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-10 tracking-tight">ArScene</h2>

        <nav className="flex flex-col gap-2 text-[17px] font-medium text-gray-700">
          {navItems.map((item) => (
            <div
              key={item.label}
              onClick={() => router.push(item.path)}
              className={`group flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl transition-all duration-200
                ${
                  isActive(item.path)
                    ? 'bg-pink-100 text-pink-700 border-l-4 border-pink-600 shadow-inner font-semibold'
                    : 'hover:bg-white/50 hover:text-pink-600 font-semibold'
                }
              `}
            >
              <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
            </div>
          ))}
        </nav>
      </div>






      <div className="flex items-center justify-between px-4 py-3 bg-white/40 rounded-xl shadow-inner hover:bg-white/50 transition-all cursor-pointer"
        onClick={() => router.push('/profile')}
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-sm shadow-lg">
            {currentUser?.email?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex flex-col">

            <span className="text-sm font-semibold text-gray-700">
              {/* {currentUser?.email ?? 'user@example.com'} */}
              {currentUser?.email ?.split('@')[0] || 'user@example.com'}

            </span>

              {/* <p className="font-semibold text-pink-600">
                       @{post.userId?.email?.split('@')[0] || 'unknown'}
                    </p> */}



          </div>
        </div>
        {/* <Settings size={18} className="text-gray-600 hover:text-pink-600" /> */}
      </div>

      
    </motion.aside>
  );
}

































































