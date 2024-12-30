/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { FaLocationDot } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { FaBusinessTime } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";

const ManageAddresses = () => {
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAddresses, setFilteredAddresses] = useState([]);

  // Fetch addresses from API
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/addresses"); // Replace with your API URL
        setSavedAddresses(response.data);
        setFilteredAddresses(response.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, []);

  // Handle searching for addresses (update only the filtered list)
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredAddresses(savedAddresses);
    } else {
      const results = savedAddresses.filter((addr) =>
        `${addr.houseNo || ""} ${addr.area || ""} ${addr.landmark || ""} ${
          addr.address || ""
        }`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
      setFilteredAddresses(results);
    }
  };

  // Add search query to recent searches when clicking the button or pressing Enter
  const handleSearchSubmit = () => {
    if (searchQuery.trim() !== "" && !recentSearches.includes(searchQuery)) {
      setRecentSearches([searchQuery, ...recentSearches]);
    }
  };

  // Handle deleting an address (API Call)
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/addresses/${id}`); // API call to delete

      // Update the state after deletion
      const updatedAddresses = savedAddresses.filter((addr) => addr._id !== id);
      setSavedAddresses(updatedAddresses);

      // Ensure filtered list reflects the updated addresses
      const updatedFilteredAddresses = filteredAddresses.filter(
        (addr) => addr._id !== id
      );
      setFilteredAddresses(updatedFilteredAddresses);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  // Handle selecting an address
  const handleSelect = (address) => {
    alert(`Address selected for delivery: ${address}`);
  };

  // Handle updating an address (API Call)
  const handleUpdate = async (id) => {
    const newAddress = prompt("Enter updated address:");
    if (newAddress) {
      try {
        const updatedAddress = { address: newAddress };
        await axios.patch(
          `http://localhost:5000/addresses/${id}`,
          updatedAddress
        ); // API call to update address
        const updatedAddresses = savedAddresses.map((addr) =>
          addr._id === id ? { ...addr, address: newAddress } : addr
        );
        setSavedAddresses(updatedAddresses);
        setFilteredAddresses(updatedAddresses);
      } catch (error) {
        console.error("Error updating address:", error);
      }
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="mb-4 text-center p-2 bg-red-600 text-white">
        Your Location
      </h1>

      {/* Search Bar */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search your area / pincode / apartment"
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearchSubmit();
          }}
          className="flex-1 px-4 py-2 border rounded-md"
        />
        <button
          onClick={handleSearchSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* List of Saved Addresses */}
      <div className="space-y-4 border-t-2 pt-2">
        <div className="font-bold">Saved Locations</div>
        {filteredAddresses.length > 0 ? (
          filteredAddresses.map((addr) => (
            <SavedContactItem
              key={addr._id}
              addr={addr}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onSelect={handleSelect}
            />
          ))
        ) : (
          <p className="text-gray-500">No addresses found.</p>
        )}
      </div>

      {/* List of Recent Searches */}
      <div className="space-y-4 border-t-2 pt-2 mt-5">
        <div className="font-bold">Recent Searches</div>
        {recentSearches.length > 0 ? (
          recentSearches.map((search, index) => (
            <RecentSearchItem key={index} search={search} />
          ))
        ) : (
          <p className="text-gray-500">No recent searches.</p>
        )}
      </div>
    </div>
  );
};

export default ManageAddresses;

// Saved Contact Item Component
function SavedContactItem({ addr, onDelete, onUpdate, onSelect }) {
  const iconMapping = {
    home: <FaHome className="text-red-500 text-xl" />,
    business: <FaBusinessTime className="text-blue-500 text-xl" />,
    friends: <FaUserFriends className="text-green-500 text-xl" />,
    default: <FaLocationDot className="text-gray-500 text-xl" />,
  };

  // Combine address components into a single string
  const fullAddress = [
    addr.houseNo, // House number
    addr.area, // Area or locality
    addr.landmark, // Landmark
    addr.address, // Main address
  ]
    .filter(Boolean) // Remove any undefined or null values
    .join(", "); // Join with a comma and space

  return (
    <div className="flex justify-between items-center p-4 border rounded-md shadow-sm">
      <div className="flex items-center gap-4">
        {/* Render Icon based on category */}
        {iconMapping[addr.category] || iconMapping.default}
        <div>
          <h2 className="text-lg font-semibold first-letter:capitalize">
            {addr.category}
          </h2>
          <p className="text-sm text-gray-600">{fullAddress}</p>
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={() => onSelect(fullAddress)}
          className="text-green-600 hover:text-green-800"
          title="Select for Delivery"
        >
          Select
        </button>
        <button
          onClick={() => onUpdate(addr._id)}
          className="text-blue-600 hover:text-blue-800"
          title="Edit Address"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(addr._id)}
          className="text-red-600 hover:text-red-800"
          title="Delete Address"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// Recent Search Item Component
function RecentSearchItem({ search }) {
  return (
    <div className="flex justify-between items-center p-4 border rounded-md shadow-sm">
      <div className="flex items-center gap-4">
        <FaLocationDot className="text-red-600" />
        <div>
          <h2 className="text-lg font-semibold">Recent Search</h2>
          <p className="text-sm text-gray-600">{search}</p>
        </div>
      </div>
    </div>
  );
}
