import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const NGOSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
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
    verifiedNGO:{
        type:String,
        required:true
    },
    ngoId:{
        type:String,
        required:true,
        unique:true
    },
    avatar:{
        type:String,
        required:true
    },
    volunteers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Volunteer"
    }],
    deliveryAgents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"DeliveryAgent"
    }],
    pendingFoodDonations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodDonation"
    }],
    foodCollected:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"FoodDonation"
    }],
    distributedFood: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodDonation"
    }],
    refreshToken:{
        type:String
    }
},{timestamps:true})

NGOSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next();
})

NGOSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

NGOSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            name:this.name,
            email:this.email,
            role:"NGO"
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

NGOSchema.methods.generateRefreshToken = function(){
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


export const NGO = mongoose.model("NGO",NGOSchema)