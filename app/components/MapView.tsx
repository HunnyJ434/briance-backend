'use client';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import polyline from '@mapbox/polyline';

// Online marker icons
const icons: Record<string, L.Icon> = {
  depot: new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/484/484167.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  }),
  pickup: new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2721/2721073.png',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  }),
  dropoff: new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2721/2721073.png',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  }),
  service: new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828919.png',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  }),
};

export type Stop = {
  type: string;
  name: string;
  lat: number;
  lng: number;
  time?: string;
  assigned_to?: string;
};

export type RouteSegment = {
  encoded: string;
  type: 'driver' | 'pickup' | 'dropoff';
};

type Props = {
  stops: Stop[];
  polylines: RouteSegment[];
};

export default function MapView({ stops, polylines }: Props) {
  const center: [number, number] = stops.length > 0
    ? [stops[0].lat, stops[0].lng]
    : [45.5, -73.6];

  return (
    <MapContainer center={center} zoom={13} className="h-[600px] w-full z-0">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Markers */}
      {stops.map((stop, idx) => {
        const icon = icons[stop.type] || icons.depot;
        return (
          <Marker key={idx} position={[stop.lat, stop.lng]} icon={icon}>
            <Tooltip direction="top" offset={[0, -25]} permanent>
              {idx + 1}
            </Tooltip>
            <Popup>
              <strong>{stop.name}</strong><br />
              Type: {stop.type}<br />
              Time: {stop.time || 'N/A'}<br />
              {stop.assigned_to && <>Cleaner: {stop.assigned_to}</>}
            </Popup>
          </Marker>
        );
      })}

      {/* Polylines */}
      {polylines.map(({ encoded, type }, idx) => {
        const decoded = polyline.decode(encoded);
        const colorMap = {
          driver: 'blue',
          pickup: 'green',
          dropoff: 'red',
        };
        return (
          <Polyline
            key={idx}
            positions={decoded.map(([lat, lng]) => [lat, lng])}
            pathOptions={{ color: colorMap[type] || 'gray', weight: 4 }}
          />
        );
      })}
    </MapContainer>
  );
}
