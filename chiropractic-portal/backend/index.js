require('dotenv').config();
const express = require('express');
const db = require('./db');

const PORT = process.env.PORT || 3131;
const app = express();

app.use(express.json());

// Import and use account routes once
const accountRoutes = require('./routes/account');
app.use('/account', accountRoutes);

// Example test route
app.get('/', (req, res) => {
  res.send('Chiro backend is running 🚀');
});

// DB test route
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.raw('SELECT NOW()');
    const time =
      (result && result.rows && result.rows[0] && result.rows[0].now) ||
      (Array.isArray(result) && result[0] && result[0].now) ||
      null;
    res.json({ time });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to connect to DB' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
