// src/pages/api/external.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  try {
    const response = await fetch('https://external-api.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || 'Login failed' });
    }

    return res.status(200).json({ token: data.token, user: data.user });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}