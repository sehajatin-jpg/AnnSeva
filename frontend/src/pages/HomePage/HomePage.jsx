import React, { useState, useEffect, useRef } from "react";
import styles from "./homePage.module.css";
import { BiSearch } from "react-icons/bi";
import { RiArrowRightSLine } from "react-icons/ri";
import { Link } from "react-router-dom";

import HeroSection from "../HeroSection/HeroSection";
import NGOCard from "../../components/NGOCard/NGOCard";
import BottomNavbar from "../../components/BottomNavbar/BottomNavbar";
import SplashScreen from "../../components/SplashScreen/SplashScreen";
import Card from "../../components/Card/card";
import SectionWithImages from "../SectionWithImages/SectionWithImges";
import SDGSection from "../../components/SDGSection/SDGSection";
import Footer from "../../components/Footer/Footer";
import AnimatedCardsSection from "../../components/AnimatedCardsSection/AnimatedCardsSection";

// const dummyData = [
//   { id: 0, image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94", NGOName: "Helping Hands NGO", mealsRequired: 120, time: "2 hrs ago" },
//   { id: 1, image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94", NGOName: "Food for All", mealsRequired: 80, time: "1 hr ago" },
//   { id: 2, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", NGOName: "Share A Meal", mealsRequired: 200, time: "30 mins ago" },
//   { id: 3, image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94", NGOName: "Kindness Kitchen", mealsRequired: 50, time: "4 hrs ago" },
//   { id: 4, image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94", NGOName: "Hunger Heroes", mealsRequired: 90, time: "3 hrs ago" },
//   { id: 5, image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94", NGOName: "Meal Givers", mealsRequired: 150, time: "5 hrs ago" },
//   { id: 6, image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94", NGOName: "Feeding Hope", mealsRequired: 180, time: "6 hrs ago" },
//   { id: 7, image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94", NGOName: "Warm Meals Initiative", mealsRequired: 110, time: "1 day ago" },
//   { id: 8, image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94", NGOName: "The Giving Plate", mealsRequired: 95, time: "2 days ago" },
//   { id: 9, image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94", NGOName: "Project Nourish", mealsRequired: 130, time: "5 days ago" },
//   { id: 10, image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94", NGOName: "Food Rescuers", mealsRequired: 175, time: "6 days ago" },
//   { id: 11, image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94", NGOName: "Community Kitchen", mealsRequired: 210, time: "1 week ago" },
//   { id: 12, image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94", NGOName: "One Meal at a Time", mealsRequired: 125, time: "8 days ago" },
//   { id: 13, image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94", NGOName: "United for Meals", mealsRequired: 160, time: "10 days ago" },
//   { id: 14, image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94", NGOName: "Together We Feed", mealsRequired: 140, time: "12 days ago" },
// ];

// const campaignImages = [
//   "https://thumbs.dreamstime.com/z/meal-food-donation-app-smartphone-volunteering-charity-concept-covid-solidarity-response-181880570.jpg",
//   "https://media.istockphoto.com/vectors/food-donation-and-charity-vector-id1224414210?k=20&m=1224414210&s=612x612&w=0&h=FhZYeea62Eh_7OM74djnSdkRBSq0kpeloV3SnyTiSpE=",
//   "https://i.pinimg.com/originals/5d/83/88/5d8388343a60c402a84a687e8ad44eae.jpg",
//   "https://www.wfp.org/sites/default/files/images/news/StopTheWaste%20Press%20Release%20Image.png",
//   "https://previews.123rf.com/images/arrow/arrow1712/arrow171200010/91915955-food-drive-donation-give-today-campaign.jpg",
//   "https://c8.alamy.com/comp/2BM08C6/meal-and-food-donation-app-on-a-smartphone-volunteering-and-charity-concept-2BM08C6.jpg",
//   "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
// ];

const HomePage = () => {
  const [showSplash, setShowSplash] = useState(false);
  const campaignSliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const hasSeenSplash = localStorage.getItem("hasSeenSplash");
    if (!hasSeenSplash) {
      setShowSplash(true);
      localStorage.setItem("hasSeenSplash", "true");
      setTimeout(() => setShowSplash(false), 2000);
    }
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - campaignSliderRef.current.offsetLeft);
    setScrollLeft(campaignSliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - campaignSliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    campaignSliderRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    const scroll = () => {
      if (campaignSliderRef.current && !isDragging) {
        campaignSliderRef.current.scrollLeft += 0.5;
      }
    };
    const interval = setInterval(scroll, 200);
    return () => clearInterval(interval);
  }, [isDragging]);

  return (
    <>
      {showSplash && <SplashScreen />}
      {!showSplash && (
        <>
          <HeroSection />
          <BottomNavbar />

          <div className={styles.main}>
            {/* <div className={styles.main_top}></div> */}
            <Card />

            <SectionWithImages/>
            <AnimatedCardsSection/>

            {/* 🔹 Volunteer Required Section - Temporarily Hidden */}
            {/*
            <div className={styles.volunteer_images}>
              <div className={styles.top}>
                <h3>Volunteer Required</h3>
                <Link to="/all">
                  <div className={styles.see_all}>
                    <p>See all</p>
                    <RiArrowRightSLine className={styles.search_icon} />
                  </div>
                </Link>
              </div>
              <div className={styles.volunteer_separator}></div>
              <div className={styles.round_images}>
                {dummyData.map((el) => (
                  <Link key={el.id} to={`/all/${el.id}`}>
                    <img
                      className={styles.round_image}
                      src={el.image}
                      alt={el.NGOName}
                    />
                  </Link>
                ))}
              </div>
            </div>
            */}

            {/* 🔹 Food Required Section - Temporarily Hidden */}
            {/*
            <div className={styles.food_required_section}>
              <div className={styles.food_required_top}>
                <h3>Food Required</h3>
                <Link to="/all">
                  <div className={styles.see_all}>
                    <p>See all</p>
                    <RiArrowRightSLine className={styles.search_icon} />
                  </div>
                </Link>
              </div>
              <div className={styles.food_separator}></div>
              {dummyData.slice(0, 3).map((el) => (
                <Link key={el.id} to={`/all/${el.id}`} className={styles.food_card_link}>
                  <NGOCard data={el} />
                </Link>
              ))}
            </div>
            */}

            {/* <div className={styles.upcoming_campaigns}>
              <div className={styles.top}>
                <h3>Upcoming Campaigns</h3>
                <Link to="/campaigns">
                  <div className={styles.see_all}>
                    <p>See all</p>
                    <RiArrowRightSLine className={styles.search_icon} />
                  </div>
                </Link>
              </div>
              <div className={styles.campaign_separator}></div>
              <div 
                className={styles.campaign_slider}
                ref={campaignSliderRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
              >
                <div className={styles.campaign_track}>
                  {campaignImages.concat(campaignImages).map((el, index) => (
                    <img key={index} className={styles.campaign_image} src={el} alt={`campaign_img_${index}`} />
                  ))}
                </div>
              </div>
            </div> */}

            {/* <div className={styles.nearby_ngo_section}>
              <div className={styles.nearby_top}>
                <h3>Nearby NGOs</h3>
                <div className={styles.see_all}>
                  <p>See all</p>
                  <RiArrowRightSLine className={styles.search_icon} />
                </div>
              </div>
              <div className={styles.nearby_separator}></div>
              <div className={styles.nearby_images}>
                {dummyData.slice(0, 2).map((el) => (
                  <Link key={el.id} to={`/all/${el.id}`}>
                    <img className={styles.nearby_image} src={el.image} alt="NGO" />
                  </Link>
                ))}
              </div>
            </div> */}

            <SDGSection/>
            <div className="footer">

            </div>
            <Footer/>

          </div>
        </>
      )}
    </>
  );
};

export default HomePage;