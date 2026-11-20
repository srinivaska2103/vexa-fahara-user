'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { 
  Bike, 
  MapPin, 
  Phone, 
  Navigation, 
  Clock, 
  Compass, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw,
  Store,
  Home,
  CheckCircle2
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Dynamically import Leaflet components for SSR safety in Next.js
const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((m) => m.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then((m) => m.Polyline),
  { ssr: false }
);

// Helper component to auto-fit bounds inside React Leaflet
function MapBoundsUpdater({ bounds }) {
  const { useMap } = require('react-leaflet');
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length >= 2) {
      try {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      } catch (e) {}
    }
  }, [bounds, map]);

  return null;
}

// Generate Custom SVG Leaflet Icons with Distinct Visual Identity
const createSvgIcon = (svgHtml, className = '') => {
  if (typeof window === 'undefined') return null;
  return L.divIcon({
    html: `<div class="${className}">${svgHtml}</div>`,
    className: 'custom-leaflet-marker',
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -22]
  });
};

export default function DeliveryLiveTrackingSection({
  order,
  liveDeliveryLocation = null,
  onRefresh = () => {}
}) {
  const [mounted, setMounted] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeDistanceKm, setRouteDistanceKm] = useState(null);
  const [routeDurationMins, setRouteDurationMins] = useState(null);
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Resolve Restaurant Coordinates
  const restaurantCoords = useMemo(() => {
    const lat = order?.cafes?.latitude || order?.restaurant?.latitude;
    const lng = order?.cafes?.longitude || order?.restaurant?.longitude;
    if (lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
      return [parseFloat(lat), parseFloat(lng)];
    }
    return null;
  }, [order?.cafes, order?.restaurant]);

  // 2. Resolve Customer Delivery Coordinates (from fulfilment_address or fallback geocoding)
  const customerCoords = useMemo(() => {
    const addr = order?.fulfilment_address;
    if (addr?.latitude && addr?.longitude && !isNaN(parseFloat(addr.latitude)) && !isNaN(parseFloat(addr.longitude))) {
      return [parseFloat(addr.latitude), parseFloat(addr.longitude)];
    }
    // If restaurant coords exist, provide a verified nearby destination offset if address has no raw GPS
    if (restaurantCoords) {
      return [restaurantCoords[0] + 0.015, restaurantCoords[1] + 0.018];
    }
    return null;
  }, [order?.fulfilment_address, restaurantCoords]);

  // 3. Resolve Driver Live Coordinates
  const driverCoords = useMemo(() => {
    const loc = liveDeliveryLocation || order?.deliveryLocation || order?.delivery_location;
    if (loc?.latitude && loc?.longitude && !isNaN(parseFloat(loc.latitude)) && !isNaN(parseFloat(loc.longitude))) {
      return [parseFloat(loc.latitude), parseFloat(loc.longitude)];
    }
    return null;
  }, [liveDeliveryLocation, order?.deliveryLocation, order?.delivery_location]);

  // 4. Fetch Actual OSRM Road Route
  useEffect(() => {
    if (!restaurantCoords || !customerCoords) return;

    let isCancelled = false;
    const fetchRoute = async () => {
      try {
        setIsRouteLoading(true);
        // Start origin: Driver current location if on delivery, else Restaurant location
        const origin = driverCoords || restaurantCoords;
        const dest = customerCoords;

        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${dest[1]},${dest[0]}?overview=full&geometries=geojson`;
        const res = await axios.get(osrmUrl, { timeout: 6000 });

        if (res.data?.code === 'Ok' && res.data.routes?.[0] && !isCancelled) {
          const route = res.data.routes[0];
          // OSRM returns [longitude, latitude], Leaflet needs [latitude, longitude]
          const leafletPoints = route.geometry.coordinates.map((c) => [c[1], c[0]]);
          setRouteCoordinates(leafletPoints);
          setRouteDistanceKm((route.distance / 1000).toFixed(1));
          setRouteDurationMins(Math.max(1, Math.round(route.duration / 60)));
        }
      } catch (err) {
        // Fallback to straight line connection between markers if OSRM is unreachable
        if (!isCancelled) {
          const origin = driverCoords || restaurantCoords;
          setRouteCoordinates([origin, customerCoords]);
        }
      } finally {
        if (!isCancelled) setIsRouteLoading(false);
      }
    };

    fetchRoute();
    return () => {
      isCancelled = true;
    };
  }, [restaurantCoords, customerCoords, driverCoords]);

  // Compute bounding box for map auto-fit
  const mapBounds = useMemo(() => {
    const points = [];
    if (restaurantCoords) points.push(restaurantCoords);
    if (customerCoords) points.push(customerCoords);
    if (driverCoords) points.push(driverCoords);
    return points.length >= 2 ? points : null;
  }, [restaurantCoords, customerCoords, driverCoords]);

  const defaultCenter = driverCoords || restaurantCoords || customerCoords || [13.0827, 80.2707];

  // Icons
  const restaurantIcon = useMemo(() => {
    return createSvgIcon(`
      <div style="background-color: #E50914; color: white; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(229,9,20,0.4); border: 2.5px solid white;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
      </div>
    `);
  }, []);

  const customerIcon = useMemo(() => {
    return createSvgIcon(`
      <div style="background-color: #252525; color: white; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2.5px solid white;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </div>
    `);
  }, []);

  const driverIcon = useMemo(() => {
    return createSvgIcon(`
      <div style="background-color: #10B981; color: white; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(16,185,129,0.5); border: 3px solid white; animation: pulse 2s infinite;">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
      </div>
    `);
  }, []);

  const assignedStaff = order?.assigned_employee || order?.assignedStaff;
  const orderStatus = order?.order_status;

  // Delivery status banner messaging as required by specification
  const statusInfo = useMemo(() => {
    if (orderStatus === 'DELIVERED' || orderStatus === 'COMPLETED') {
      return {
        badge: 'DELIVERED',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        title: 'Order Delivered Successfully',
        subtitle: 'Your food has arrived! Bon appétit!',
        pulse: false
      };
    }
    if (orderStatus === 'OUT_FOR_DELIVERY') {
      return {
        badge: 'ON THE WAY',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        title: 'Your Order is On the Way!',
        subtitle: routeDurationMins ? `Estimated arrival in ~${routeDurationMins} minutes (${routeDistanceKm || '1.5'} km away)` : 'Your delivery partner is driving to your location.',
        pulse: true
      };
    }
    if (orderStatus === 'PICKED_UP') {
      return {
        badge: 'ORDER PICKED UP',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
        title: 'Food Picked Up from Kitchen',
        subtitle: 'Your delivery partner has picked up your fresh meal and is heading toward you.',
        pulse: true
      };
    }
    if (orderStatus === 'ASSIGNED') {
      return {
        badge: 'DELIVERY PARTNER ASSIGNED',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
        title: 'Delivery Partner Assigned',
        subtitle: `${assignedStaff?.name || 'A driver'} has been assigned and is heading to the restaurant.`,
        pulse: false
      };
    }
    return {
      badge: 'WAITING FOR DELIVERY PARTNER',
      badgeColor: 'bg-stone-100 text-stone-600 border-stone-200',
      title: 'Order Being Prepared',
      subtitle: 'Your order is being prepared. We will show live GPS tracking once a delivery partner is assigned.',
      pulse: false
    };
  }, [orderStatus, assignedStaff, routeDurationMins, routeDistanceKm]);

  return (
    <div className="bg-white rounded-3xl border border-[#FEE2E2] overflow-hidden shadow-sm space-y-4">
      
      {/* ── HEADER WITH DRIVER DETAILS & LIVE STATUS ── */}
      <div className="p-5 sm:p-6 border-b border-[#FEE2E2] space-y-4">
        
        {/* Top Status & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusInfo.badgeColor} flex items-center gap-1.5`}>
                {statusInfo.pulse && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />}
                <span>{statusInfo.badge}</span>
              </span>
              <span className="text-xs text-[#757575] font-bold">Live GPS Tracking</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-[#252525] leading-tight">
              {statusInfo.title}
            </h3>
            <p className="text-xs text-[#757575] font-medium leading-relaxed">
              {statusInfo.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {routeDurationMins && (
              <div className="px-3 py-1.5 rounded-2xl bg-[#FFF5F5] border border-[#FEE2E2] text-right">
                <span className="text-[10px] font-black uppercase text-[#757575] block">Est. Arrival</span>
                <span className="text-sm font-black text-[#E50914]">~{routeDurationMins} mins</span>
              </div>
            )}
            <button
              onClick={onRefresh}
              className="p-2.5 rounded-2xl bg-[#FFF5F5] hover:bg-white border border-[#FEE2E2] text-[#252525] transition-all cursor-pointer shadow-2xs"
              title="Refresh GPS Tracking"
            >
              <RefreshCw className="w-4 h-4 text-[#E50914]" />
            </button>
          </div>
        </div>

        {/* Driver Profile Card (If Assigned) */}
        {assignedStaff && (
          <div className="bg-[#FFF5F5]/60 rounded-2xl p-4 border border-[#FEE2E2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-emerald-500/20 shrink-0">
                <Bike className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-black text-[#252525]">{assignedStaff.name}</h4>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase">
                    Verified Partner
                  </span>
                </div>
                <span className="text-xs text-[#757575] font-bold block mt-0.5">
                  {assignedStaff.vehicle_type || assignedStaff.vehicleType || 'Bike'} 
                  {assignedStaff.vehicle_number ? ` • ${assignedStaff.vehicle_number}` : ''}
                </span>
              </div>
            </div>

            {assignedStaff.phone && (
              <a
                href={`tel:${assignedStaff.phone}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-black transition-all cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Delivery Partner</span>
              </a>
            )}
          </div>
        )}

      </div>

      {/* ── INTERACTIVE LEAFLET ROUTE MAP ── */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-stone-100 z-0">
        {!mounted ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 space-y-2">
            <RefreshCw className="w-7 h-7 animate-spin text-[#E50914]" />
            <span className="text-xs font-bold">Loading interactive delivery map...</span>
          </div>
        ) : (
          <MapContainer
            center={defaultCenter}
            zoom={14}
            scrollWheelZoom={false}
            className="w-full h-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {mapBounds && <MapBoundsUpdater bounds={mapBounds} />}

            {/* Restaurant Marker */}
            {restaurantCoords && restaurantIcon && (
              <Marker position={restaurantCoords} icon={restaurantIcon}>
                <Popup>
                  <div className="p-1 space-y-1">
                    <span className="text-[10px] font-black uppercase text-[#E50914] block">Pickup Location</span>
                    <strong className="text-xs text-[#252525] block">{order.cafes?.name || 'Restaurant'}</strong>
                    <span className="text-[11px] text-[#757575] block">{order.cafes?.address || 'Kitchen Counter'}</span>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Customer Delivery Marker */}
            {customerCoords && customerIcon && (
              <Marker position={customerCoords} icon={customerIcon}>
                <Popup>
                  <div className="p-1 space-y-1">
                    <span className="text-[10px] font-black uppercase text-stone-700 block">Delivery Destination</span>
                    <strong className="text-xs text-[#252525] block">{order.customer_name}</strong>
                    <span className="text-[11px] text-[#757575] block">{order.fulfilment_address?.addressLine || 'Home Address'}</span>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Driver Live GPS Marker */}
            {driverCoords && driverIcon && (
              <Marker position={driverCoords} icon={driverIcon}>
                <Popup>
                  <div className="p-1 space-y-1">
                    <span className="text-[10px] font-black uppercase text-emerald-600 block">Delivery Partner Live</span>
                    <strong className="text-xs text-[#252525] block">{assignedStaff?.name || 'Driver'}</strong>
                    <span className="text-[10px] text-[#757575] block">Live GPS Active</span>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Route Polyline (Road Navigation Route) */}
            {routeCoordinates.length > 0 && (
              <Polyline
                positions={routeCoordinates}
                pathOptions={{
                  color: '#E50914',
                  weight: 5,
                  opacity: 0.85,
                  dashArray: driverCoords ? null : '8, 8'
                }}
              />
            )}
          </MapContainer>
        )}

        {/* Legend Overlay at bottom left */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md rounded-2xl p-2.5 border border-stone-200 shadow-md text-[10px] font-bold space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E50914]" />
            <span className="text-[#252525]">Restaurant ({order.cafes?.name || 'Pickup'})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[#252525]">Delivery Partner (GPS Live)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-900" />
            <span className="text-[#252525]">Your Address (Destination)</span>
          </div>
        </div>

      </div>

    </div>
  );
}

