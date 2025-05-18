//import mongoose from 'mongoose';
const mongoose = require('mongoose');

const TransformSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    selectedStyle: { type: String, default: '',}, // Stores user input on how they want the photo
    selectedImage: { type: String, default: '' }, // Path to the uploaded product photo
    generatedImageUrl: { type: String, default: '', required: true },

},
{ timestamps: true });

//export default mongoose.models.Photography || mongoose.model('Photography', PhotographySchema);
module.exports = mongoose.models.Transform || mongoose.model('Transform', TransformSchema);
