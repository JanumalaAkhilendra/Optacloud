// import React from "react";
/* eslint-disable react/prop-types */
import { IoSearchSharp } from "react-icons/io5";
import { MdOutlineMyLocation } from "react-icons/md";
import { MdLocationOff } from "react-icons/md";
const Modal = ({ isOpen, onClose, onEnableLocation, onSearchManually }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg  w-80 ">
        <div className="text-red-600 flex justify-center">
          <MdLocationOff size={100} />
        </div>
        <h2 className="text-lg font-semibold text-center">
          Location permission is off
        </h2>
        <p className="mt-2 text-sm text-gray-600 text-center">
          We need your location to find the nearest store & provide you a
          seamless delivery experience
        </p>
        <div className="mt-4 space-y-2">
          <button
            onClick={onEnableLocation}
            className="py-2 bg-red-600 text-white rounded hover:bg-red-500 w-full flex justify-center items-center gap-2"
          >
            <MdOutlineMyLocation />
            <p>Enable Location</p>
          </button>
          <button
            onClick={onSearchManually}
            className=" py-2 bg-gray-300 rounded hover:bg-gray-400 w-full flex justify-center items-center gap-2 text-red-600 font-semibold"
          >
            <IoSearchSharp /> <p>Search Manually</p>
          </button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Modal;
