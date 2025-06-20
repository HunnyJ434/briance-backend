const getOptimizedRoute = async () => {
  console.log("📦 Loading data from /data.json...");
  const res = await fetch('/data.json');
  const stops = await res.json();
  console.log("✅ Original stops loaded:", stops);

  console.log("🚀 Sending data to optimizer backend...");
  const optRes = await fetch('https://fastapi-backend-659062608768.us-central1.run.app/optimize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stops }),
  });

  console.log("📥 Awaiting response from optimizer...");
  const result = await optRes.json();
  console.log("✅ Received optimization result:", result);

  const { ordered_stops } = result;
  const ordered = ordered_stops.map((i: number) => stops[i]);
  console.log("🗺️ Reordered stops based on optimized route:", ordered);

  return ordered;
};

export default getOptimizedRoute;