'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default Leaflet icon paths in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map resize and bounds updating
function MapUpdater({ markers, center }) {
  const map = useMap();

  useEffect(() => {
    // Invalidate size immediately & delayed to fix mobile rendering tiles
    map.invalidateSize();
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    if (markers && markers.length > 0) {
      const bounds = L.latLngBounds();
      let hasValidMarkers = false;

      markers.forEach(marker => {
        const lat = parseFloat(marker.latitude || marker.lat);
        const lng = parseFloat(marker.longitude || marker.lng);
        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          bounds.extend([lat, lng]);
          hasValidMarkers = true;
        }
      });

      if (hasValidMarkers) {
        map.flyToBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      } else if (center) {
        map.flyTo(center, 13);
      }
    } else if (center) {
      map.flyTo(center, 13);
    }

    return () => clearTimeout(timer);
  }, [map, markers, center]);

  return null;
}

export default function MapComponent({ center = [12.9716, 77.5946], markers = [] }) {
  return (
    <div className="w-full h-full min-h-full relative z-0 isolate overflow-hidden">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={false} 
        className="w-full h-full min-h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater markers={markers} center={center} />
        
        {/* Fallback center marker if no markers exist */}
        {markers.length === 0 && (
          <Marker position={center}>
            <Popup>
              <div className="p-1 font-sans">
                <strong className="text-xs font-black text-[#2C1810]">Fahara Location Center</strong>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Cafe Markers */}
        {markers.map((marker, index) => {
          const rawLat = parseFloat(marker.latitude || marker.lat);
          const rawLng = parseFloat(marker.longitude || marker.lng);
          
          const lat = !isNaN(rawLat) && rawLat !== 0 ? rawLat : center[0] + (index * 0.005);
          const lng = !isNaN(rawLng) && rawLng !== 0 ? rawLng : center[1] + (index * 0.005);

          return (
            <Marker key={marker.id || marker._id || index} position={[lat, lng]}>
              <Popup>
                <div className="p-1 font-sans text-stone-800 space-y-1">
                  <strong className="text-xs font-black text-[#2C1810] block">{marker.name || 'Cafe Venue'}</strong>
                  <p className="text-[10px] text-stone-500 font-medium">{marker.city || marker.address || 'Explore venue details'}</p>
                  {marker.price_per_hour && (
                    <span className="text-[10px] font-black text-[#6F4E37] block">₹{marker.price_per_hour}/HR</span>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
