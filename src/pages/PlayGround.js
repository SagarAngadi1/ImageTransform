import Sidebar from '../components/SideBar';
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'; // Correct import
import { parseCookies } from 'nookies';
import fetchCurrentUser from '../../utils/fetchCurrentUser';
import axios from 'axios'; // Import axios




const styles = ['GTA 6 Game','Ghibli', 'Lego', 'Pixar', 'Anime', 'Van Gogh', 'Cyberpunk', 'Sketch', 'Watercolor'];

export default function PlayGround({ currentUser }) {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // Preview for product photo

  const [selectedStyle, setSelectedStyle] = useState('');
  const [outputImage, setOutputImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('transform'); // 'transform' or 'scenario'
  const [user, setUser] = useState(currentUser);
  const router = useRouter();
  const [scenarioQuote, setScenarioQuote] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);  //was not here




   
  

   
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
    



  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

      //This got added now
      const reader = new FileReader();
      reader.onloadend = () => {
      setImage(file);
      setImagePreview(reader.result); // Preview image after reading it
      };
      reader.readAsDataURL(file);


    // if (file) {
    //   setImage(file)
    //   //setImage(URL.createObjectURL(file));
    // }
  };









  const handleGenerate = async () => {
    setLoading(true);


    if (!user) {
      // Redirect to SignUp.js if user is not authenticated
      router.push('/signup');
      return;
    }

    // if (user.credits < 50) {
    //   alert('You need at least 50 credits to generate a product photo.');
    //   return;
    // }


     // Prepare form data
     const formData = new FormData();
     if (image) { formData.append("selectedImage", image);  }
     formData.append("selectedStyle", selectedStyle);
     formData.append("userId", user._id); 

     if (mode === 'scenario') {
      formData.append("scenarioQuote", scenarioQuote);
      }else{
      formData.append("scenarioQuote", "None");
      }
      //if (mode === 'scenario') {
      formData.append("mode", mode);
      //}


     try {
      const res = await fetch('/api/saveTransform', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      // Set loading state to false after receiving the response
      setLoading(false);

      if (res.ok) {
      const generatedPhoto = data.generatedProductPhoto;
      
      const generatedImagePath = data.generatedProductPhotoURL
      //setGeneratedImageUrl(generatedImagePath);
      setOutputImage(generatedImagePath);
      setGeneratedImageUrl(generatedImagePath);


   
        //alert('Product Photography Data stored successfully!');
        console.log('Data saved successfully:', data);
        console.log('generatedImage:', generatedImagePath);
      } else {
        throw new Error('Failed to store data');
      }

    } catch (error) {
      console.error('Error creating photography data:', error);
      alert('Failed to Store Data: ' + error.message);
    }



    setTimeout(() => {
      //setOutputImage('/sample-output.jpg'); // Replace with actual response image URL
      setLoading(false);
      if(step == 3){
      setStep(4);
      }else{
        setStep(3)
      }
    }, 2000);
  };




   // Axios method to download image as a blob
   const downloadImage = async () => {
    try {

      if (!generatedImageUrl) {
        alert("Image URL not available for download.");
        return;
      }

      console.log('Attempting to download image from URL:', generatedImageUrl); 
      const response = await axios.get(generatedImageUrl, {
        responseType: 'blob',  // Set response type to 'blob'
      });

      console.log('Image download response:', response); 

      // Create a link element, use it to download the image
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'generated-product-photo.jpg'); // Filename for the download
      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up the element
    } catch (error) {
      console.error('Error downloading the image:', error);
      alert('Failed to download the image');
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#ffc1cc] to-[#fceabb]">
      {/* <Sidebar /> */}

    <div className="w-64">
    {/* <Sidebar /> */}
    <Sidebar currentUser={user} />
    </div>
      
    <main className="flex-1 p-0 flex flex-col items-center justify-center">


{/* TOGGLE SWITCH */}
<div className="w-full flex justify-end mb-6 pr-2 mt-2">
  <div className="flex items-center gap-2 bg-white/40 backdrop-blur-lg p-2 rounded-full shadow-md">
    <span className={`px-4 py-1 rounded-full cursor-pointer transition text-md ${mode === 'transform' ? 'bg-pink-500 text-white' : 'text-gray-700'}`} onClick={() => setMode('transform')}>
      Image Transform
    </span>
    <span className={`px-4 py-1 rounded-full cursor-pointer transition text-md ${mode === 'scenario' ? 'bg-pink-500 text-white' : 'text-gray-700'}`} onClick={() => setMode('scenario')}>
      Scenario Builder
    </span>
  </div>
</div>









{/* STEP TRACKER */}
<div className="flex justify-center mb-10 mt-6 w-full">
  <div className="relative flex items-center w-full max-w-3xl px-8">
    {(mode === 'transform' ? [1, 2, 3] : [1, 2, 3, 4]).map((num, index, arr) => {
      const isCompleted = step > num;
      const isActive = step === num;

      return (
        <div key={num} className="relative z-10 flex flex-col items-center w-1/4">
          {index < arr.length - 1 && (
            <div className={`absolute top-5 left-1/2 transform -translate-x-0.5 w-full h-1 ${step > num ? 'bg-pink-500' : 'bg-white/50'}`} />
          )}
          <div className={`z-20 flex items-center justify-center w-10 h-10 rounded-full text-black font-bold border-2 transition-all duration-300 ${
              isCompleted
                ? 'bg-pink-500 border-pink-500'
                : isActive
                ? 'bg-white text-pink-600 border-pink-500'
                : 'bg-white/40 text-gray-600 border-white/60'
            }`}>
            {num}
          </div>
          <div className="mt-2 text-sm font-medium text-gray-800 text-center">
            {mode === 'transform' && (
              num === 1 ? 'Upload' : num === 2 ? 'Select Style' : 'Process'
            )}
            {mode === 'scenario' && (
              num === 1 ? 'Upload' : num === 2 ? 'Style' : num === 3 ? 'Quote' : 'Finish'
            )}
          </div>
        </div>
      );
    })}
  </div>
</div>













<div className="w-full max-w-4xl bg-white/40 backdrop-blur-lg p-4 rounded-3xl shadow-2xl border border-white/20 min-h-[500px] flex flex-col">
  {/* Card Body: Main Section */}
{mode === 'transform' ? (
  // ======== IMAGE TRANSFORM UI ==========
  <div className="flex-grow mt-6">

    {step === 1 && (
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-xl font-bold text-gray-700">Upload Image To Transform</h2>

        {!imagePreview ? (
          <label
            htmlFor="image-upload"
            className="cursor-pointer border-2 border-dashed border-pink-300 bg-white/60 hover:bg-white/80 text-center rounded-2xl p-10 w-full max-w-xs shadow-lg transition-all"
          >
            <div className="flex flex-col items-center gap-2">
              <p className="text-gray-700 font-medium">Click to upload or drag & drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, JPEG – Max 5MB</p>
            </div>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        ) : (
          <label htmlFor="image-upload" className="cursor-pointer">
            <img
              src={imagePreview}
              alt="preview"
              className="w-64 h-64 object-cover rounded-2xl shadow-lg hover:opacity-90 transition"
            />
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
    )}

    {step === 2 && (
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-xl font-bold text-gray-800">Choose a Style</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {styles.map((style) => (
            <div
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`cursor-pointer px-4 py-6 rounded-2xl text-center font-semibold text-gray-700 shadow-md backdrop-blur-md transition border border-white/30 ${
                selectedStyle === style ? 'bg-pink-500 text-white' : 'bg-white/50 hover:bg-white/70'
              }`}
            >
              {style}
            </div>
          ))}
        </div>
      </div>
    )}




    {/* {step === 3 && (
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-xl font-bold text-gray-800">Transformed Image</h2>
        <div className="relative w-4/5 max-w-lg h-auto">

        {loading ? (
          <p className="text-pink-600 font-semibold">Processing Image...</p>
        ) : (
          <img
            src={outputImage}
            alt="output"
            className="w-72 h-72 object-cover rounded-2xl shadow-xl"
          />
        )}

        <button
        onClick={downloadImage}  // Call the downloadImage function
        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-200 transition"
        >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        </button>
        
        </div>
       
      </div>
    )} */}


{step === 3 && (
  <div className="flex flex-col items-center gap-6">
    <h2 className="text-xl font-bold text-gray-800">Transformed Image</h2>
    <div className="relative w-72 h-72"> {/* Match the image size here */}
      {loading ? (
        <p className="text-pink-600 font-semibold">Processing Image...</p>
      ) : (
        <>
          <img
            src={outputImage}
            alt="output"
            className="w-full h-full object-cover rounded-2xl shadow-xl"
          />
          <button
            onClick={downloadImage}
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-200 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </>
      )}
    </div>
  </div>
)}






  </div>
) : (



  // ======== SCENARIO BUILDER UI ==========
  <div className="flex-grow mt-6">
    {step === 1 && (
   


<div className="flex flex-col items-center gap-6">
<h2 className="text-xl font-bold text-gray-700">Upload Image To Transform</h2>

{!imagePreview ? (
  <label
    htmlFor="image-upload"
    className="cursor-pointer border-2 border-dashed border-pink-300 bg-white/60 hover:bg-white/80 text-center rounded-2xl p-10 w-full max-w-xs shadow-lg transition-all"
  >
    <div className="flex flex-col items-center gap-2">
      <p className="text-gray-700 font-medium">Click to upload or drag & drop</p>
      <p className="text-xs text-gray-500">PNG, JPG, JPEG – Max 5MB</p>
    </div>
    <input
      id="image-upload"
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="hidden"
    />
  </label>
) : (
  <label htmlFor="image-upload" className="cursor-pointer">
    <img
      src={imagePreview}
      alt="preview"
      className="w-64 h-64 object-cover rounded-2xl shadow-lg hover:opacity-90 transition"
    />
    <input
      id="image-upload"
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="hidden"
    />
  </label>
)}
</div>

      
    )}

    {step === 2 && (
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-xl font-bold text-gray-800">Choose a Scene Style</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {styles.map((style) => (
            <div
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`cursor-pointer px-4 py-6 rounded-2xl text-center font-semibold text-gray-700 shadow-md backdrop-blur-md transition border border-white/30 ${
                selectedStyle === style ? 'bg-pink-500 text-white' : 'bg-white/50 hover:bg-white/70'
              }`}
            >
              {style}
            </div>
          ))}
        </div>
      </div>
    )}

    

    {step === 3 && (
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-xl font-bold text-gray-800">Add Quote</h2>
        <textarea
          placeholder="Add an inspiring quote..."
          className="w-full max-w-md p-4 rounded-xl shadow-md border border-pink-300 bg-white/60"
          value={scenarioQuote}
          onChange={(e) => setScenarioQuote(e.target.value)}
          rows={5}
        />
      </div>
    )}

    {step === 4 && (
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-xl font-bold text-gray-800">Final Scenario Image</h2>

        <div className="relative w-72 h-72 max-w-lg"> 

        {loading ? (
          <p className="text-pink-600 font-semibold">Generating Image...</p>
        ) : (
          <img
            src={outputImage}
            alt="scenario output"
            className="w-72 h-72 object-cover rounded-2xl shadow-xl"
          />
        )}

        <button
        onClick={downloadImage}  // Call the downloadImage function
        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-200 transition"
        >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        </button>


        
        </div>

      </div>
    )}







    
  </div>
)}






  
  
  

  <div className="mt-auto pt-6 flex justify-end">
  {mode === 'transform' ? (
  <>
    {step === 1 && image && (
      <button onClick={() => setStep(2)} className="px-6 py-3 rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600 transition">
        Next
      </button>
    )}
    {step === 2 && selectedStyle && (
      <button onClick={handleGenerate} className="px-6 py-3 rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600 transition">
        Generate 🎨
      </button>
    )}
  </>
) : (
  <>

    {step === 1 && image && (
      <button onClick={() => setStep(2)} className="px-6 py-3 rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600 transition">
        Next
      </button>
    )}
     {step === 2 && selectedStyle && (
      <button onClick={() => setStep(3)} className="px-6 py-3 rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600 transition">
        Next
      </button>
    )}

    {step === 3 && (
      <button
        onClick={handleGenerate}
        className="px-6 py-3 rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600 transition"
      >
        Generate Scene 🌅
      </button>
    )}
  </>
)}

  </div>
</div>

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




