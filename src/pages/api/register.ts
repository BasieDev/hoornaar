import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Customize the JSON here
  const customData = {
    username: req.body.gebruikersnaam,
    firstName: req.body.voornaam,
    lastName: req.body.achternaam,
    email: req.body.email,
    password: req.body.wachtwoord,
    // Add or transform fields as needed
  };

  try {
    const apiRes = await fetch('http://localhost:2735', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customData),
    });
    const apiData = await apiRes.json();
    return res.status(apiRes.status).json(apiData);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to reach external API', error: (error as Error).message });
  }
}