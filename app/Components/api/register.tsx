// pages/api/register.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { username, email } = req.body;
      // Add validation and save user to the database
      try {
        // Simulated database operation
        // Replace with actual database logic
        // Example: const newUser = await createUser(username, email);
        const newUser = { username, email };
        res.status(201).json({ message: 'User registered successfully', user: newUser });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Registration failed' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  