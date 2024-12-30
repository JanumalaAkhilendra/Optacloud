/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility"; // To fix icon rendering
import L from "leaflet"; // For custom marker icons
import { MdOutlineMyLocation } from "react-icons/md";
import AddressModal from "./AddressModal";

const Map = ({ location }) => {
  const [marker, setMarker] = useState(null); // Marker state
  const [landmark, setLandmark] = useState("Fetching landmark..."); // Store landmark
  const [address, setAddress] = useState("Fetching address..."); // Store address
  const [showModal, setShowModal] = useState(false); // Modal visibility

  // Create a custom marker icon
  const customIcon = new L.Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });

  // Reverse Geocoding function
  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      if (data.display_name) {
        const parts = data.display_name.split(",");
        setLandmark(parts[0]?.trim() || "Unknown Landmark");
        setAddress(parts.slice(1).join(", ").trim() || "Unknown Address");
      } else {
        setLandmark("Unknown Landmark");
        setAddress("Unknown Address");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setLandmark("Unable to fetch landmark");
      setAddress("Unable to fetch address");
    }
  };

  // Update marker and fetch address on location prop update
  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location;
      setMarker({ latitude, longitude });
      fetchAddress(latitude, longitude);
      setShowModal(true); // Show the modal
    }
  }, [location]);

  // Handle map click event using useMapEvent inside MapContainer
  const MapEvents = () => {
    useMapEvent("click", (event) => {
      const { lat, lng } = event.latlng;
      setMarker({ latitude: lat, longitude: lng });
      setLandmark("Fetching landmark...");
      setAddress("Fetching address...");
      fetchAddress(lat, lng);
      setShowModal(true); // Show the modal
    });
    return null;
  };

  return (
    <>
      {/* Address Modal */}
      {showModal && (
        <AddressModal
          landmark={landmark}
          address={address}
          location={marker}
          onClose={() => setShowModal(false)} // Close modal
        />
      )}
      <LocateMe setMarker={setMarker} fetchAddress={fetchAddress} />
      {/* Map Container */}
      <MapContainer
        center={
          location
            ? [location.latitude, location.longitude]
            : [28.6139, 77.2088] // Default center if no marker
        }
        zoom={10}
        style={{ width: "95%", height: "90vh", margin:"5vh" }}
      >
        {/* TileLayer for OpenStreetMap */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Map events handler */}
        <MapEvents />

        {/* Render marker if position exists */}
        {marker && (
          <Marker
            position={[marker.latitude, marker.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div>
                <strong>Coordinates:</strong>{" "}
                {marker.latitude ? marker.latitude.toFixed(4) : "N/A"},{" "}
                {marker.longitude ? marker.longitude.toFixed(4) : "N/A"}
                <br />
                <strong>Landmark:</strong> {landmark}
                <br />
                <strong>Address:</strong> {address}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </>
  );
};

export default Map;

// LocateMe Component with Functionality
function LocateMe({ setMarker, fetchAddress }) {
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarker({ latitude, longitude });
          fetchAddress(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error.message);
          alert(
            "Unable to get your location. Please check your browser settings."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div
      onClick={handleLocateMe}
      className="cursor-pointer w-max rounded-md flex items-center justify-center bottom-[23vh] right-[46vw] fixed z-[1050] bg-white p-3 gap-2 shadow-black shadow-md"
    >
      <MdOutlineMyLocation className="text-red-600" />
      <p className="font-semibold">Locate Me</p>
    </div>
  );
}
