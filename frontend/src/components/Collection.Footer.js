import React from "react";
import Logo from "../assets/unnamed.png";

export default function CollectionFooter() {
  return (
    <div className="flex place-content-center pb-24">
      <div className="flex flex-row space-x-10 w-full justify-center items-center">
        <div class="flex justify-center h-32">
          <img
            class="object-scale-down max-h-full w-fit"
            src={Logo}
            alt=""
          />
        </div>
        <div className="flex flex-col">
          <h3 className="font-bold uppercase">
            The Museum of Fine Arts, Houston
          </h3>
          <h4>Main Address: 1001 Bissonet, Houston, Texas 77005</h4>
          <h4>Main Information Line: 713.639.7300</h4>
          <h4>Copyright © 2024, The Museum of Fine Arts, Houston.</h4>
          <h4>All rights reserved.</h4>
        </div>
      </div>
    </div>
  );
}
