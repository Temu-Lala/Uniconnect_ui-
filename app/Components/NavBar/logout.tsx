// pages/api/logout.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Implement your logout logic here, such as deleting the token from the session
    // Example: req.session.destroy();
    res.status(200).json({ message: 'Logout successful' });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
