const express = require('express');
const cors = require('cors');
const connectDB = require('./src/connection/db');
const userRoutes = require('./src/routes/user');
const personRoutes = require('./src/routes/person');
require('dotenv').config();

const app = express();

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[INCOMING] ${req.method} ${req.url} from ${req.ip}`);
  next();
});

// Apply CORS globally
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());
connectDB();

app.use('/users', userRoutes);
app.use('/persons', personRoutes);

// Root test route
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Listen on all interfaces
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://192.168.29.130:${PORT}`);
});
