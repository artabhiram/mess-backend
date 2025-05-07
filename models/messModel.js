import mongoose from "mongoose";

const messSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    primaryColor: { type: String },
    secondaryColor: { type: String },
    cardColor: { type: String },         // Add this
    textColor: { type: String },         // Add this
  }, { minimize: false });
  
  

const messModel = mongoose.models.mess|| mongoose.model("mess", messSchema);
export default messModel;