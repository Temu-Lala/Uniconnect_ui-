import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet for type definitions

interface MapProps {
  location?: { lat: number; lng: number };
  setLocation: (location: { lat: number; lng: number }) => void;
}

const MapInput: React.FC<MapProps> = ({ location, setLocation }) => {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    const mapInstance = mapRef.current;
    if (mapInstance && !location) {
      mapInstance.setView([51.505, -0.09], 13); // Initial center (London) and zoom
    }
  }, [location]);

  const handleClick = (e: L.LeafletMouseEvent) => {
    setLocation(e.latlng);
  };

  return (
    <MapContainer center={location} zoom={13} whenReady={mapRef.current?.setView.bind(null, [51.505, -0.09], 13)} ref={mapRef}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {location && (
        <Marker position={location}>
          <Popup>Your chosen location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapInput;
