export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages,
      max_tokens: 220,
      temperature: 0.65,
    }),
  });

  const data = await groqRes.json();

  if (!groqRes.ok) {
    return res.status(groqRes.status).json({ error: data.error?.message || 'Groq error' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json(data);
}
