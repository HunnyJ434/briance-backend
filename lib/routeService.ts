const getOptimizedRoute = async () => {
  // Load original data
  const res = await fetch('/data.json');
  const stops = await res.json();

  // Call the optimizer backend
  const optRes = await fetch('https://fastapi-backend-659062608768.us-central1.run.app/optimize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stops }),
  });

  const { ordered_stops } = await optRes.json();

  // Reorder stops based on optimized route
  const ordered = ordered_stops.map((i: number) => stops[i]);
  return ordered;
};
export default getOptimizedRoute;
