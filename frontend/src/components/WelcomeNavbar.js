import { React, useState } from "react";
import { Link } from "react-router-dom";

export default function WelcomeNavbar() {
  const [showLoginOption, setShowLoginOption] = useState(false);

  return (
    <div className="absolute z-10 top-10 right-10 font-hk-grotesk">
      <div className="flex flex-row text-ivory space-x-6">
        <Link
          to="/About"
          className="border-2 border-ivory rounded-full px-4 hover:bg-ivory hover:text-charcoal transition-all ease-in-out duration-700"
        >
          About
        </Link>
        <Link
          to="/Exhibitions"
          className="border-2 border-ivory rounded-full px-4 hover:bg-ivory hover:text-charcoal transition-all ease-in-out duration-700"
        >
          Exhibitions
        </Link>
        <Link
          to="/Collections"
          className="border-2 border-ivory rounded-full px-4 hover:bg-ivory hover:text-charcoal transition-all ease-in-out duration-700"
        >
          Collections
        </Link>
        <Link
          to="/Tickets"
          className="border-2 border-ivory rounded-full px-4 hover:bg-ivory hover:text-charcoal transition-all ease-in-out duration-700"
        >
          Get Tickets
        </Link>
        <Link
          to="/Shop"
          className="border-2 border-ivory rounded-full px-4 hover:bg-ivory hover:text-charcoal transition-all ease-in-out duration-700"
        >
          MFA Shop
        </Link>
        <Link
          to="/Login"
          className="font-extrabold text-lg tracking-wider"
        >
          LOGIN
        </Link>
      </div>
    </div>
  );
}
