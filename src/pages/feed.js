import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import fetchCurrentUser from '../../utils/fetchCurrentUser';
import Sidebar from '../components/SideBar';
import axios from 'axios';


export default function Home({ currentUser }) {
  const router = useRouter();
  const [navVisible, setNavVisible] = useState(false);
  const [user, setUser] = useState(currentUser);
  const [posts, setPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [view, setView] = useState('foryou'); // 'foryou' | 'trending'
  const [activeTab, setActiveTab] = useState('For You');
  const [loading, setLoading] = useState(true);



  const profileImages = {
  sagar_angadi: 'exercise.png',
  techie_girl: 'meditate.png',
  default: 'walking.png',
  };


  const timeAgo = (hours) => {
  if (hours < 1) return 'Just now';
  if (hours === 1) return '1 hour ago';
  return `${hours} hours ago`;
  };


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


    useEffect(() => {
    if (!currentUser) {
      const fetchUser = async () => {
        try {
          const res = await fetch('/api/fetchCurrentUser', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            console.warn('User session expired. Redirecting to login...');
          }
        } catch (err) {
          console.error("Client-side fetch user failed:", err);
        }
      };

      fetchUser();
    }
  }, [currentUser]);








    useEffect(() => {

    const fetchAllImages = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/getAllImages");
        // if (res.data.success && res.data.images.length > 0) {
        //   setPosts(res.data.images);
        // } 
        if (res.data.success && res.data.images.length > 0) {
             const safePosts = res.data.images.map(post => ({
             ...post,
             reactions: post.reactions || {}, // Ensure reactions field exists
        }));
         setPosts(safePosts);
        }
        else {
          setPosts([]);
        }
      } catch (err) {
        console.error("Failed to fetch images:", err);
        setError("Could not load feed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllImages();
  }, []);


















  useEffect(() => {
    // Dummy posts
    const dummyPosts = [
      {
        id: 1,
        user: 'sagar_angadi',
        content: 'Just styled this with AI ✨',
        image: 'creativewriting.png',
        reactions: { '❤️': 4, '🔥': 2 },
      },
      {
        id: 2,
        user: 'techie_girl',
        content: 'My dream scene built with Scenario Builder 🌄',
        image: 'fantasyBackground.png',
        reactions: { '💡': 3, '❤️': 1 },
      },
    ];

    setPosts(dummyPosts);
    setTrendingPosts(dummyPosts.slice(0, 1));
  }, []);



  const addReaction = (postId, emoji) => {
    const target = view === 'trending' ? trendingPosts : posts;
    const setTarget = view === 'trending' ? setTrendingPosts : setPosts;

    setTarget(prev =>
      prev.map(p =>
        p.id === postId
          ? {
              ...p,
              reactions: {
                ...p.reactions,
                [emoji]: (p.reactions[emoji] || 0) + 1,
              },
            }
          : p
      )
    );
  };




  return (




  <div className="min-h-screen bg-gradient-to-br from-[#ffc1cc] to-[#fceabb] flex items-start justify-center gap-35">
  {/* LEFT SIDEBAR */}
  <div className="w-64">
    <Sidebar currentUser={user} />
  </div>

  {/* CENTER FEED */}
  <div className="flex-1 max-w-2xl flex flex-col gap-4 mt-6">
    {/* FEED HEADER */}
    {/* <h1 className="text-center text-3xl font-bold text-pink-600 drop-shadow-sm">Creator Feed</h1> */}

    {/* TOGGLE TABS */}
    <div className="w-full flex justify-center">
      <div className="w-full bg-white/50 backdrop-blur-md border border-white/40 rounded-full p-1 flex justify-between">
        {['For You', 'Trending'].map(option => (
          <button
            key={option}
            onClick={() => setActiveTab(option)}
            className={`flex-1 text-center px-4 py-2 rounded-full font-semibold transition-all ${
              activeTab === option ? 'bg-pink-500 text-white shadow' : 'text-gray-700'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>

    {/* POSTS */}
    {activeTab === 'Trending' ? (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔥 Trending Posts</h2>
        <div className="flex flex-col gap-4">
          {trendingPosts.map(post => (
            <div key={post.id} className="bg-white/60 rounded-xl p-4 shadow-md border border-white/30">
              <p className="text-gray-700 font-semibold">@{post.userId}</p>
              <p className="text-gray-600">{post.content}</p>
            </div>
          ))}
        </div>
      </motion.div>
    ) : (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col gap-6"
      >
        {/* {posts.map(post, idx) */}
        {/* {posts.map(post */}
        
        {posts.map(post => (
          <div
            key={post.id}
            className="bg-white/40 backdrop-blur-lg p-6 rounded-3xl shadow-md border border-white/30"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={profileImages[post.user] || profileImages.default}
                alt="Profile"
                className="w-10 h-10 rounded-full border border-white/60 object-cover"
              />
              <div>
                <p className="font-semibold text-pink-600">
                       @{post.userId?.email?.split('@')[0] || 'unknown'}
                    </p>

                {/* <p className="font-semibold text-pink-600">{user?.email ?? 'user@example.com'}</p> */}
                {/* <p className="text-sm text-gray-500">{timeAgo(post.hoursAgo)}</p> */}
                <p className="text-sm text-gray-500">{post.createdAtFormatted}</p>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{post.content}</p>
            {/* {post.image && ( */}
            <div>
                   <img
                src={post.generatedImageUrl}
                alt="Post"
                className="rounded-xl border border-white/20 mb-4 w-full max-h-96 object-cover"
              />

            </div>
           
             {/* )} */}

            <div className="flex gap-3 flex-wrap mt-2">
              {['❤️', '🔥', '💡', '😂'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => addReaction(post.id, emoji)}
                  className="flex items-center gap-1 px-3 py-1 bg-white/80 text-lg rounded-full border border-gray-300 shadow-sm hover:scale-105 hover:bg-white transition-all duration-200"
                >
                  {emoji} <span className="text-sm">{post.reactions[emoji] || 0}</span>
                </button>
              ))}
            </div>


          </div>
        ))}
      </motion.div>
    )}
  </div>

  {/* RIGHT SIDEBAR: MOST ACTIVE USERS */}
  <div className="w-64 hidden lg:block mt-6">
    <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-4 border border-white/30 shadow-md">
      <h2 className="text-xl font-extrabold text-gray-700 mb-4 tracking-tight">Active Users</h2>
      <div className="flex flex-col gap-4">
        {[
          { username: 'sagar_angadi', image: profileImages.sagar_angadi },
          { username: 'techie_girl', image: profileImages.techie_girl },
          { username: 'creative_mind', image: profileImages.default },
        ].map(user => (
          
        <div key={user.username} className="flex items-center gap-3">
           <img
           src={user.image}
           alt={user.username}
           className="w-10 h-10 rounded-full border border-white object-cover"
          />
          <div className="flex flex-col">
             <p className="font-semibold text-pink-600">@{user.username}</p>
             <p className="text-sm text-gray-600">{user.postCount} Posts</p>
          </div>
        </div>




        ))}
      </div>
    </div>
  </div>
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
