import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Fix leaflet icon issue in Next.js
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapPreview({ lat, lng }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    delete L.Icon.Default.prototype._getIconUrl;
  }, []);

  if (!mounted) {
    return <div className="h-[350px] sm:h-[400px] w-full bg-stone-100 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="h-[350px] sm:h-[400px] w-full z-0 relative">
      <MapContainer 
        key={`${lat}-${lng}`}
        center={[lat, lng]} 
        zoom={15} 
        scrollWheelZoom={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={customIcon}>
          <Popup>
            Cafe Location
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
