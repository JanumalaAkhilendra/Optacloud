/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { FaBusinessTime } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import axios from "axios"; // Import Axios
import { useNavigate } from "react-router";
const AddressModal = function ({ landmark, address }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [houseNum, setHouseNum] = useState(""); // State to hold house number
  const [area, setArea] = useState(""); // State to hold apartment/road/area
  const [saveAs, setSaveAs] = useState(""); // State to hold save as option
  const navigate = useNavigate();
  function handleAddressClick() {
    setIsFormOpen(true);
  }

  // Function to handle form submission and send POST request
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const data = {
      houseNo: houseNum,
      area,
      category: saveAs, // Use saveAs as the category (Home, Office, etc.)
      landmark, // Include the landmark
      address, // Include the full address
    };

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        "http://localhost:5000/addresses",
        data
      );

      console.log("Address saved:", response.data);
      setIsFormOpen(false);
      navigate("/addresses");
      // Optionally close the form after successful submission
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleEnableClick = () => {
    navigate('/addresses');
  };

  useEffect(() => {
    setIsFormOpen(false);
  }, [landmark, address]);

  return (
    <div className="cursor-pointer w-max rounded-md flex m-auto bottom-12 left-1/2 ring-2 ring-red-600 -translate-x-1/2 fixed z-[1060] bg-white p-5 gap-5">
      <div className="" onClick={handleAddressClick}>
        {!isFormOpen && (
          <p className="text-xs font-semibold">Select your delivery location</p>
        )}

        <div className="flex items-center pt-5">
          <FaLocationDot className="text-red-600 text-3xl" />
          <p className="text-3xl">{landmark}</p>
        </div>
        <div className="text-xs pt-2">{address}</div>

        {isFormOpen && (
          <form onSubmit={handleSubmit} className="flex flex-col mt-5 ">
            <label htmlFor="" className="mt-2">
              HOUSE / FLAT / BLOCK NO.
            </label>
            <input
              type="text"
              value={houseNum}
              onChange={(e) => setHouseNum(e.target.value)} // Update houseNum state
              className="focus:outline-none focus:border-black border-b-2"
              required
            />
            <label htmlFor="" className="mt-5">
              APARTMENT / ROAD / AREA
            </label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)} // Update area state
              className="focus:outline-none focus:border-black border-b-2"
              required
            />
            <label htmlFor="" className="mt-5">
              SAVE AS
            </label>
            <ul className="flex gap-3 pt-5">
              <li
                className={`rounded-full ring-2 ring-black w-10 p-1 flex justify-center ${
                  saveAs === "home" && "bg-black text-white"
                }`}
                onClick={() => setSaveAs("home")}
              >
                <FaHome className="text-2xl" />
              </li>
              <li
                className={`rounded-full ring-2 ring-black w-10 p-1 flex justify-center ${
                  saveAs === "business" && "bg-black text-white"
                }`}
                onClick={() => setSaveAs("business")}
              >
                <FaBusinessTime className="text-2xl" />
              </li>
              <li
                className={`rounded-full ring-2 ring-black w-10 p-1 flex justify-center ${
                  saveAs === "friends" && "bg-black text-white "
                }`}
                onClick={() => setSaveAs("friends")}
              >
                <FaUserFriends className="text-2xl" />
              </li>
              <li
                className={`rounded-full ring-2 ring-black w-10 p-1 flex justify-center ${
                  saveAs === "other" && "bg-black text-white"
                }`}
                onClick={() => setSaveAs("other")}
              >
                <FaLocationDot className="text-2xl" />
              </li>
            </ul>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md mt-5"
            >
              Save Address
            </button>
          </form>
        )}
      </div>

      {!isFormOpen && (
        <div className="flex flex-col justify-around">
          <div className="rounded-md px-2 py-0.5 ring-2 ring-red-600 font-bold text-center" onClick={handleEnableClick}>
            Enable 
          </div>
          <div className="bg-red-600 text-white px-2 py-1 rounded-md text-center">
            Change
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressModal;
