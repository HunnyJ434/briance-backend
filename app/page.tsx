'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import TimelineView from './components/TimelineView';
const MapView = dynamic(() => import('./components/MapView'), { ssr: false });
import type { RouteSegment } from './components/MapView';
export default function Home() {
  const [route, setRoute] = useState([]);
const [polylines, setPolylines] = useState<RouteSegment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(data => {
        fetch('https://fastapi-backend-659062608768.us-central1.run.app/optimize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then(res => res.json())
          .then(res => {
            setRoute(res.route);
            setPolylines(res.polylines);
          })
          .catch(err => {
            console.error('POST error:', err);
            setError('Failed to send optimization request.');
          });
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError('Failed to load data.');
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 space-y-8 p-4">
      <h1 className="text-3xl text-black font-bold">Briance Route Optimization</h1>
      {error && <div className="bg-red-100 text-red-800 p-2 rounded">{error}</div>}
      <div className="rounded shadow overflow-hidden h-[600px]">
        <MapView stops={route} polylines={polylines} />
      </div>
      <TimelineView stops={route} />
    </main>
  );
}
