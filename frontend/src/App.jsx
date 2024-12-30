import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Map from "./components/Map"; // Your Map component file path
import ManageAddresses from "./components/ManageAddresses";
import Model from "./components/Model";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addresses" element={<ManageAddresses />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [showMapManually, setShowMapManually] = useState(false); // New state for manual map

  useEffect(() => {
    // Check for geolocation availability
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error.message);
          setIsModalOpen(true); // Show modal if geolocation fails
        }
      );
    } else {
      setIsModalOpen(true); // Show modal if geolocation not supported
    }
  }, []);

  const handleEnableLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsModalOpen(false); // Close modal
      },
      (error) => {
        console.error("Failed to enable geolocation:", error.message);
        if (error.code === error.PERMISSION_DENIED) {
          alert(
            "Please enable location access in your browser settings to retry."
          );
        }
      }
    );
  };

  const handleSearchManually = () => {
    setIsModalOpen(false); // Close modal
    setShowMapManually(true); // Show map manually
  };

  return (
    <>
      {location || showMapManually ? (
        <Map location={location} />
      ) : (
        <div>
          {isModalOpen && (
            <Model
              isOpen={isModalOpen}
              onEnableLocation={handleEnableLocation}
              onSearchManually={handleSearchManually} // Pass manual search handler
            />
          )}
        </div>
      )}
    </>
  );
}

export default App;
