import express, { urlencoded } from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";

app.use(cors({
    origin:process.env.ALLOWED_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))

app.use(cookieParser())

import authRoutes from "./routes/auth.routes.js";
import volunteerRoutes from "./routes/volunteer.routes.js"
import foodDonationRoutes from "./routes/foodDonation.routes.js"
import ngoRoutes from "./routes/ngo.routes.js"
import hireRequestRoutes from "./routes/hireRequest.routes.js"
import deliveryAgentRoutes from "./routes/deliveryAgent.routes.js"
import deliveryRoutes from "./routes/delivery.routes.js"




app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/volunteers",volunteerRoutes)
app.use("/api/v1/food-donations",foodDonationRoutes)
app.use("/api/v1/ngos",ngoRoutes)
app.use("/api/v1/hire-requests",hireRequestRoutes)
app.use("/api/v1/delivery-agents",deliveryAgentRoutes)
app.use("/api/v1/deliveries",deliveryRoutes)


export {app}