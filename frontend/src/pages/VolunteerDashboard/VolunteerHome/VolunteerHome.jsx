import React from 'react';
import VolunteerDashboardNavbar from '../VolunteerDashboardNavbar/VolunteerDashboardNavbar';
import VisionMissionSection from '../../../components/VisionMissionSection/VisionMissionSection';
import VolunteerSpeak from '../../../components/VolunteerSpeak/VolunteerSpeak';
import Footer from '../../../components/Footer/Footer';
import VolunteerDashboardHeroSection from '../VolunteerDashboardHeroSection/VolunteerDashboardHeroSection';
import WhyVolunteerSection from '../WhyVolunteerSection/WhyVolunteerSection';


const VolunteerHome = () => {
  return (
    <>
    <VolunteerDashboardNavbar/>
    <VolunteerDashboardHeroSection/>
    <VolunteerSpeak/>
    <VisionMissionSection/>
    <WhyVolunteerSection/>
    <Footer/>
    </>

  );
};

export default VolunteerHome;
