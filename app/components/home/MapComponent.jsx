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
    // Invalidate size to fix broken tile fetching when map container unhides
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    if (markers && markers.length > 0) {
      const bounds = L.latLngBounds();
      let hasValidMarkers = false;

      markers.forEach(marker => {
        const lat = parseFloat(marker.latitude || marker.lat);
        const lng = parseFloat(marker.longitude || marker.lng);
        if (!isNaN(lat) && !isNaN(lng)) {
          bounds.extend([lat, lng]);
          hasValidMarkers = true;
        }
      });

      if (hasValidMarkers) {
        map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      } else if (center) {
        map.flyTo(center, 13);
      }
    } else if (center) {
      map.flyTo(center, 13);
    }
  }, [map, markers, center]);

  return null;
}

export default function MapComponent({ center = [51.505, -0.09], markers = [] }) {
  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      scrollWheelZoom={false} 
      className="w-full h-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater markers={markers} center={center} />
      
      {/* Current Location Marker (optional fallback if no markers) */}
      {markers.length === 0 && (
        <Marker position={center}>
          <Popup>Center Location</Popup>
        </Marker>
      )}
      
      {/* Cafe Markers */}
      {markers.map((marker) => {
        const lat = parseFloat(marker.latitude || marker.lat || center[0] + 0.01);
        const lng = parseFloat(marker.longitude || marker.lng || center[1] + 0.01);
        return (
          <Marker key={marker.id || Math.random()} position={[lat, lng]}>
            <Popup>
              <strong>{marker.name || 'Cafe'}</strong><br/>
              {marker.distance || 'Near'} you
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
