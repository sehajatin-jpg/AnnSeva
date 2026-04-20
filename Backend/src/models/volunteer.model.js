import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const volunteerSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        default:"default-volunteer-avatar.png"
    },
    phone:{
        type:String,
        required:true,
        match:[/^\+?[1-9]\d{9,14}$/,"Please enter a valid phone number"]
    },
    address:{
        type:String,
        required:true
    },
    pendingFoodDonations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodDonation"
    }],
    completedFoodDonations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodDonation"
    }],
    refreshToken:{
        type:String
    }
},{timestamps:true})

volunteerSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next();
})

volunteerSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

volunteerSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            username:this.username,
            email:this.email,
            role:"Volunteer"
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

volunteerSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const Volunteer = mongoose.model("Volunteer",volunteerSchema)