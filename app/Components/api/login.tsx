// pages/api/login.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { username, password } = req.body;
      // Add authentication logic
      try {
        // Simulated authentication
        // Replace with actual authentication logic
        // Example: const user = await authenticateUser(username, password);
        if (username === 'example' && password === 'password') {
          res.status(200).json({ message: 'Login successful' });
        } else {
          throw new Error('Invalid credentials');
        }
      } catch (error) {
        console.error('Error:', error);
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  