import { useState } from 'react';
import { Upload, Image as ImageIcon, Library, Heart, UserCircle, Wand2 } from 'lucide-react';
// import UploadFlow from '@/components/UploadFlow';
// import Gallery from '@/components/Gallery';
// import ScenarioBuilder from '@/components/ScenarioBuilder';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [currentView, setCurrentView] = useState('upload');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0eafc] to-[#cfdef3] flex">
      
      {/* Sidebar */}
      <aside className="w-24 bg-white/20 backdrop-blur-md shadow-xl rounded-r-3xl flex flex-col items-center py-8 gap-8 border-r border-white/30">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <ImageIcon className="w-7 h-7" />
        </div>

        {[ 
          { icon: <Upload className="w-6 h-6" />, view: 'upload' },
          { icon: <Wand2 className="w-6 h-6" />, view: 'scenarios' },
          { icon: <Library className="w-6 h-6" />, view: 'gallery' },
          { icon: <Heart className="w-6 h-6" />, view: 'favorites' }
        ].map(({ icon, view }) => (
          <button
            key={view}
            onClick={() => setCurrentView(view)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300
              ${currentView === view
                ? 'bg-gradient-to-br from-purple-400 to-indigo-500 text-white shadow-md'
                : 'text-gray-500 hover:bg-white/30 hover:text-indigo-600'}`}
          >
            {icon}
          </button>
        ))}

        <div className="mt-auto">
          <button className="w-14 h-14 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-white/30 transition-all">
            <UserCircle className="w-7 h-7" />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">

          <AnimatePresence mode="wait">
            {currentView === 'upload' && (
              <motion.section
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="bg-white/40 backdrop-blur-lg p-10 rounded-3xl shadow-2xl"
              >
                <h1 className="text-5xl font-extrabold text-gray-800 mb-6 tracking-tight drop-shadow-md">
                  Transform Your Images
                </h1>
                <p className="text-lg text-gray-600 mb-10">
                  Upload your photo and choose a magical style like Ghibli, Lego, Pixar, Anime, and more.
                </p>
                {/* <UploadFlow /> */}
              </motion.section>
            )}

            {currentView === 'scenarios' && (
              <motion.section
                key="scenarios"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                {/* <ScenarioBuilder /> */}
              </motion.section>
            )}

            {currentView === 'gallery' && (
              <motion.section
                key="gallery"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                {/* <Gallery title="My Gallery" /> */}
              </motion.section>
            )}

            {currentView === 'favorites' && (
              <motion.section
                key="favorites"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                {/* <Gallery title="Favorites" filterFavorites /> */}
              </motion.section>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}

