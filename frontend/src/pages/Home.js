//import { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import React from "react";
import { Link } from "react-router-dom";
import Giordano from "../assets/Luca_Giordano_-_Allegory_of_Prudence_-_Google_Art_Project.jpg";
import MFA from "../assets/MFAH.Beck-View-S-Interior.jpg";
import Ferri from "../assets/Ciro_Ferri_-_Moses_and_the_Daughters_of_Jethro_-_BF.1982.5_-_Museum_of_Fine_Arts.jpg";
import Pietro from "../assets/Pietro_da_Cortona_-_Saint_Constantia's_Vision_before_the_Tomb_of_Saints_Agnes_and_Emerentiana_-_Google_Art_Project.jpg";
import Gallery from "../assets/visitors-in-beck-gallery.4566162743393514636.jpg";

import WelcomeNavbar from "../components/WelcomeNavbar";
import Footer from "../components/Footer";
import HomepageCollections from "../components/HomepageCollections";
import HomepageExhibitions from "../components/HomepageExhibitions";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen space-y-24 font-hk-grotesk">
      <div>
          <WelcomeNavbar />
          <h1 className="absolute z-10 text-ivory text-7xl font-black bottom-20 left-20 font-goudy-sm">
            The Museum of Fine Arts, Houston
          </h1>
          <div className="h-min overflow-hidden rounded-md">
            <img
              className="object-cover max-h-full w-full m-auto hover:scale-125 transition-all duration-700 ease-in-out"
              src={Pietro}
              alt=""
            />
          </div>
      </div>
      <HomepageExhibitions />
      <Footer />
    </div>
  );
}
