export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const headers = { Authorization: `Bearer ${token}` };

  try {
    // Get all items from the list
    const listRes = await fetch(`${url}/lrange/samos:captures/0/-1`, { headers });
    const listData = await listRes.json();
    const raw = listData.result || [];

    if (!raw.length) return res.status(200).json({ items: [] });

    // Parse items
    const items = raw.map(r => {
      try { return JSON.parse(r); } catch(e) { return null; }
    }).filter(Boolean);

    // Clear the list
    await fetch(`${url}/del/samos:captures`, { headers });

    return res.status(200).json({ items });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
