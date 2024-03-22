import { React, useState } from "react";
import UserNavbar from "../components/UserNavbar";
import Angelico from "../assets/images/1200px-Fra_Angelico_-_Saint_Anthony_Abbot_Shunning_the_Mass_of_Gold_-_Google_Art_Project.jpg";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import Footer from "../components/Footer";

export default function Donate() {
  const donationAmount = [5, 10, 25, 50, 100, 250, 500];
  const [amount, setAmount] = useState(5);
  const [otherOpen, setOtherOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <UserNavbar />

      <div className="flex flex-col pt-36 pb-24 px-16 gap-y-24 font-inter">
        <div className="flex flex-col gap-y-4">
          <h1 className="font-fanwoodText italic text-7xl">Support the MFAH</h1>
          <p className="text-xl font-inter">
            Thank you for choosing to give to
            <span className="text-cinnabar font-bold">
              The Museum of Fine Arts, Houston
            </span>
            . More than 30 percent of our visitors enter the Museum for free. We
            provide art education to more than 100,000 visitors and students
            each year, whether on-site or through our community programs and
            online learning. Our audience is 90 percent local, and our community
            depends on us.{" "}
          </p>
          <p className="text-xl font-inter">
            Through an encyclopedic permanent collection, landmark exhibitions,
            and an array of educational and interpretive programs, the Museum
            allows visitors to explore the visual world across cultures and time
            periods. Your contribution to the Museum Annual Fund powers these
            activities and connects visitors with our world-class institution.
          </p>
        </div>
        <div className="flex flex-col gap-y-24 font-inter">
          <div className="h-96">
            <img
              className="brightness-75 rounded-xl object-cover object-top h-full w-full outline outline-offset-8 outline-gray-50"
              src={Angelico}
              alt=""
            />
          </div>

          <form className="flex flex-col space-y-12">
            <div className="flex flex-col space-y-20">
              <div className="flex flex-col space-y-10 w-fit">
                <h2 className="font-fanwoodText text-5xl">Donation</h2>
                <div className="flex flex-row space-x-4">
                  {donationAmount.map((number, index) => (
                    <p
                      key={index}
                      className={`rounded-full border border-obsidian w-fit py-2 px-6 ${
                        amount === number && !otherOpen
                          ? "bg-obsidian text-chalk"
                          : "hover:bg-rose-100 hover:text-obsidian"
                      }`}
                      onClick={() => {setAmount(number); setOtherOpen(false)}}
                    >
                      ${number}
                    </p>
                  ))}
                  <p
                    className={`rounded-full border border-obsidian w-fit py-2 px-6 ${
                      otherOpen
                        ? "bg-obsidian text-chalk"
                        : "hover:bg-rose-100 hover:text-obsidian"
                    }`}
                    onClick={() => setOtherOpen(!otherOpen)}
                  >
                    Other
                  </p>
                </div>

                <div className={`${otherOpen ? "flex flex-col space-y-2 w-1/2" : "hidden"}`}>
                  <label className="font-bold">Amount</label>
                  <div className="flex flex-row border border-obsidian rounded-md justify-between bg-obsidian">
                    <p className=" text-chalk p-2 w-1/6 text-center">
                      $
                    </p>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-white text-end w-full px-4 py-2"
                    ></input>
                    <p className="b text-chalk p-2 w-1/6 text-center">
                      USD
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="font-bold">Donation Note</label>
                  <textarea
                    className="bg-white border border-obsidian rounded-md p-4"
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="bg-obsidian text-chalk rounded-md p-4 font-bold text-xl hover:bg-cinnabar transition-all duration-500 ease-in-out"
            >
              Donate ${amount} now
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
