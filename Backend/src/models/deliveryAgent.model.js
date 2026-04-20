import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const deliveryAgentSchema = new mongoose.Schema({
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
    bio:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        default:"default-agent-avatar.png"
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
    drivingId:{
        type:String,
        required:true
    },
    drivingLisence:{
        type:String,
        required:true
    },
    assignedNGO:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"NGO",
        default:null
    },
    deliveries:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Delivery"
    }],
    refreshToken:{
        type:String
    }
},{timestamps:true})

deliveryAgentSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next();
})

deliveryAgentSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

deliveryAgentSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            username:this.username,
            email:this.email,
            role:"DeliveryAgent"
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

deliveryAgentSchema.methods.generateRefreshToken = function(){
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


export const DeliveryAgent = mongoose.model("DeliveryAgent",deliveryAgentSchema)