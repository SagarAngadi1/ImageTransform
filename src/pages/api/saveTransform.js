import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import connectToDatabase from '../../../utils/mongoose';
import User from '../../../models/User';              // Importing the User model
import Transform from '../../../models/Transform'; // Your Photography model/schema
import axios from 'axios'; // Import axios for making the request to FastAPI
import { uploadFile } from '../../../utils/s3'; // Import the uploadFile function
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';
import { toFile, OpenAI } from "openai";

export const config = {
    api: {
      bodyParser: false, // Important for file uploads
    },
};

// const openai = new OpenAI();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Or however you're setting it
  });
  


async function refineAdBanner(prompt, openaiImage, mode, scenarioQuote ) {
    try {


        let finalPrompt = prompt;
        if (scenarioQuote !== 'None') {
          finalPrompt += `. Add this quote inside the image, make sure the complete quote is displayed correctly: "${scenarioQuote}"`;
        }

        


        const response = await openai.images.edit({
            model: "gpt-image-1",
            image: [openaiImage],
            prompt: finalPrompt,
            //prompt: prompt,
            size: "1024x1400",
            quality: "medium",
           // response_format: "b64_json",
            n: 1,
          });

      const b64Image = response.data[0].b64_json;
      console.log("OpenAI response full:", response);
  
      const buffer = Buffer.from(b64Image, "base64");

      // const fileName = `banner-${uuidv4()}.png`;
      // const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
      // await writeFile(filePath, buffer);
      // const generatedImageUrl = `/uploads/${fileName}`; // This is assuming you're serving /public as static
  
      const fileName = `banner-${uuidv4()}.jpeg`; // or .png depending on format you want
      const s3Result = await uploadFile(buffer, fileName);
      const generatedImageUrl = s3Result.Location;

      console.log("GenerateS3 URL", generatedImageUrl);



      return {
        gpt4oResult: prompt,
        generatedProductPhotoURL: generatedImageUrl
      };
    } catch (error) {
      console.error("Error generating ad banner image:", error.response?.data || error);
      throw new Error("Image generation failed");
    }
  }
  














const handler = async (req, res) => {


    if (req.method === 'POST') {
      const form = formidable({
        uploadDir: path.join(process.cwd(), '/public/uploads'), // Directory where files will be uploaded
        keepExtensions: true, // Keep file extensions
        multiples: true, // Allow multiple file uploads (productPhoto, referencePhoto)
      });
  
  
      
      // Parse the incoming form data
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Error parsing form:", err);
          return res.status(500).send('Error parsing the form');
        }
  
        const { selectedStyle, userId } = fields;
        const selectedImage = files.selectedImage ? files.selectedImage[0] : undefined;
        console.log("Uploaded files:", files);

  
  
        console.log('Selected Style:', selectedStyle);
        console.log('Selected Image:', selectedImage);
        console.log('userId:', userId);
   
        try {
  
          await connectToDatabase();
  
          const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
          const user = await User.findById(userId);
  
          console.log('Current User:', user);
  
  
          if (!user) {
            console.log('Error: User not found ');
            return res.status(404).json({ message: 'User not found' });
  
          }
  
          if (user.credits < 50) {
            console.log('Not enough credits:', user.credits);
            return res.status(400).json({ message: 'Not enough credits' });
          }
  
   
          
  
  
          //  if (productPhoto) {
          //   const productPhotoName = `${Date.now()}-${productPhoto.originalFilename}`;
          //   const productPhotoBuffer = fs.readFileSync(productPhoto.filepath);
          //   const result = await uploadFile(productPhotoBuffer, productPhotoName);
          //   productPhotoS3Url = result.Location; // S3 URL for the product photo
          // }
  


          // if (referencePhoto) {
          //   const referencePhotoName = `${Date.now()}-${referencePhoto.originalFilename}`;
          //   const referencePhotoBuffer = fs.readFileSync(referencePhoto.filepath);
          //   const result = await uploadFile(referencePhotoBuffer, referencePhotoName);
          //   referencePhotoS3Url = result.Location; // S3 URL for the reference photo
          // }
      
  
  
         
  
  
          // Call FastAPI to refine the input details
         // const refinedInput = await refineAdBanner(combinedInputDetails, productPhotoS3Url, referencePhotoS3Url);
          //const refinedInput = await refineAdBanner(combinedInputDetails);




          console.log("selectedImage details:", selectedImage);

          if (!selectedImage) {
            throw new Error("No product image uploaded.");
          }
          
          const openaiImage = await toFile(
            fs.createReadStream(selectedImage.filepath),
            selectedImage.originalFilename,
            {
              type: selectedImage.mimetype || "image/png",
            }
          );

        
          
          const selectedStyle = Array.isArray(fields.selectedStyle) ? fields.selectedStyle[0] : fields.selectedStyle;
          const mode = Array.isArray(fields.mode) ? fields.mode[0] : fields.mode;
          const scenarioQuote = Array.isArray(fields.scenarioQuote) ? fields.scenarioQuote[0] : fields.scenarioQuote;


          const prompt = `(lighnting) sharp details on the face and suit looking to the right make the iamge black and white crop the image above the hands, focusing on the upper body remove the background and replace it with a blakc one. 
Use artificial lightning on the face and shoulder precisely enhance the shadows (not just a basic black-and-white conversion) Adjust gaze to look slightly downard`;
                   
          //const prompt = `You are an image transform expert, transform this image to ${selectedStyle} style, make sure the style is expressed in the photo at the best quality.`;
          
          //const prompt = 'Can you generate a banner ad for this product, it should have these details: Title : The best moisturiser for your skin, Subnote: Chemical free for your skin, Off label: 15% OFF, CTA: Buy now, Keep the style modern and sleek';

          const refinedInput = await refineAdBanner(prompt, openaiImage, mode, scenarioQuote );

  
          if (!refinedInput) {
            return res.status(500).json({ success: false, error: 'Error refining photography details' });
          }
         console.log('Refined Photography Data:', refinedInput);
  
  
          // Save the photography details to the database
          const newTransform = new Transform({
            selectedStyle: selectedStyle, 
            // productPhoto: productPhotoS3Url, 
            // referencePhoto: referencePhotoS3Url,
            generatedImageUrl: refinedInput.generatedProductPhotoURL,
            userId: userId,
          });
  
          await newTransform.save();
          console.log('New Transform Entry:', newTransform);
  
          // If image generation is successful, deduct 50 credits
          user.credits -= 50;
          await user.save();
  
  
          return res.status(201).json({
             success: true,
             data: newTransform, 
             refinedInput: refinedInput.gpt4oResult, 
             //generatedProductPhoto: refinedInput.generatedProductPhoto,  COMMENDTED THIS NOW
             generatedProductPhotoURL: refinedInput.generatedProductPhotoURL //WAS NOT HERE, ADdED AFTER CHATGPT IMAGE URL
  
          }); 
        } catch (error) {
          console.error("Error saving Transform details:", error);
          return res.status(500).json({ success: false, error: 'Server error' });
        }
      });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  };
  
  
  
  
  export default handler;



