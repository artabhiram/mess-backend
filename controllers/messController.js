import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import messModel from "../models/messModel.js"
import fs from 'fs';

//create token
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

//login user
const loginMess = async (req, res) => {
    const { email, password } = req.body;
    try {
      const mess = await messModel.findOne({ email });
  
      if (!mess) {
        return res.json({ success: false, message: "User does not exist" });
      }
  
      const isMatch = await bcrypt.compare(password, mess.password);
  
      if (!isMatch) {
        return res.json({ success: false, message: "Invalid credentials" });
      }
  
      const token = createToken(mess._id);
  
      // Exclude password before sending to client
      const { password: _, ...messData } = mess._doc;
  
      res.json({ success: true, token, mess: messData });
  
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" });
    }
  };
  

//register user
const registerMess = async (req,res) => {
    const {name, email, password} = req.body;
    try{
        //check if user already exists
        const exists = await messModel.findOne({email})
        if(exists){
            return res.json({success:false,message: "Mess already exists"})
        }
        

        // validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success:false,message: "Please enter a valid email"})
        }
        if(password.length<8){
            return res.json({success:false,message: "Please enter a strong password"})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const newMess = new messModel({name, email, password: hashedPassword})
        const mess = await newMess.save()
        const token = createToken(mess._id)
        res.json({success:true,token})

    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// all food list
const listMess = async (req, res) => {
    try {
        const messes = await messModel.find({})
        res.json({ success: true, data: messes })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}
const updateMessTheme = async (req, res) => {
    try {
      const messId = req.body.messId;
      const { primaryColor, secondaryColor, cardColor, textColor } = req.body;
      const image = req.file?.filename;
  
      const mess = await messModel.findById(messId);
      if (!mess) return res.status(404).json({ success: false, message: "Mess not found" });
  
      if (image && mess.image && fs.existsSync(`uploads/${mess.image}`)) {
        fs.unlinkSync(`uploads/${mess.image}`);
      }
  
      mess.primaryColor = primaryColor || mess.primaryColor;
      mess.secondaryColor = secondaryColor || mess.secondaryColor;
      mess.cardColor = cardColor || mess.cardColor;
      mess.textColor = textColor || mess.textColor;
      if (image) mess.image = image;
  
      await mess.save();
  
      res.json({ success: true, message: "Theme and logo updated", data: mess });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: "Server error" });
    }
  };

  
export {loginMess, registerMess, listMess,updateMessTheme}