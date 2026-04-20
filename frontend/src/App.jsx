import "./App.css";
import HomePage from "./pages/HomePage/HomePage";
import VolunteerSignup from "./pages/VolunteerSignup/signup-volunteer";
import SignupNGO from "./pages/signup-ngo/signup-ngo"; 
import SignupDelivery from "./pages/signup-delivery/signup-delivery";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import VolunteerHome from "./pages/VolunteerDashboard/VolunteerHome/VolunteerHome";
import VolunteerProfile from "./pages/VolunteerDashboard/VolunteerProfile/VolunteerProfile";
import VolunteerDonate from "./pages/VolunteerDashboard/VolunteerDonate/VolunteerDonate";
import VolunteerActivity from "./pages/VolunteerDashboard/VolunteerActivity/VolunteerActivity";
import NGOList from "./pages/VolunteerDashboard/NGOList/NGOList";
import NGODashboardHome from "./pages/NGODashboard/NGODashboardHome/NGODashboardHome";
import NgoProfile from "./pages/NGODashboard/NgoProfile/NgoProfile";
import HireDeliveryAgents from "./pages/NGODashboard/HireDeliveryAgents/HireDeliveryAgents";
import HiredAgents from "./pages/NGODashboard/HiredAgents/HiredAgents";
import NGODonations from "./pages/NGODashboard/NGODonations/NGODonations";
import DeliveryDashboardHome from "./pages/DeliveryAgentDashboard/DeliveryDashboardHome/DeliveryDashboardHome";
import DeliveryGetHired from "./pages/DeliveryAgentDashboard/DeliveryGetHired/DeliveryGetHired";
import DeliveryActivity from "./pages/DeliveryAgentDashboard/DeliveryActivity/DeliveryActivity";
import Login from "./pages/Login/Login";


function App() {
  // const [foodData, setFoodData] = useState({ type: "", meal: "", quantity: 0 });

  // const handleInput = (e) => {
  //   const { name, value } = e.target;
  //   setFoodData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // useEffect(() => {
  //   const user = localStorage.getItem("user");
  //   if (user) {
  //     console.log("User already logged in:", JSON.parse(user));
  //   }
  // }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<HomePage />} />


          {/* Signup as Volunteer */}
          <Route path="/signup-volunteer" element={<VolunteerSignup />} />

          {/* Signup as NGO */}
          <Route path="/signup-ngo" element={<SignupNGO />} />

          {/* Signup as Delivery Agent */}
          <Route path="/signup-delivery" element={<SignupDelivery />} />

          <Route path="/login" element={<Login/>} />

          {/* ✅ Volunteer Dashboard */}
          
          {/* <Route path="/volunteer-dashboard" element={<VolunteerDashboard/>}/> */}

          {/* VOLUNTEER DASHBOARD SECTION */}
          <Route path="/volunteerDashboard/home" element={<VolunteerHome/>} /> 

          <Route path="/volunteerDashboard/profile" element={<VolunteerProfile/>} />

          <Route path="/volunteerDashboard/NGOlist/donate" element={<VolunteerDonate/>} />

          <Route path="/volunteerDashboard/activity" element={<VolunteerActivity/>} />

          <Route path="/volunteerDashboard/NGOlist" element={<NGOList/>} />

            {/* NGO DASHBOARD SECTION */}
          <Route path="/NGODashboard/home" element={<NGODashboardHome/>} />
          <Route path="/NGODashboard/profile" element={<NgoProfile/>}/>
          <Route path="NGODashboard/hireDeliveryAgents" element={<HireDeliveryAgents/>} />
          <Route path="/NGODashboard/hireDeliveryAgents/hired-agents" element={<HiredAgents/>} />
          <Route path="/NGODashboard/donations" element={<NGODonations/>}/>

          {/* DELIVERY AGENT DASHBOARD SECTION */}
          <Route path="/DeliveryAgentDashboard/home" element={<DeliveryDashboardHome/>} />
          <Route path="/DeliveryAgentDashboard/getHired" element={<DeliveryGetHired/>} />
          <Route path="/DeliveryAgentDashboard/activity" element={<DeliveryActivity/>} />

          {/* 404 Page */}

          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;