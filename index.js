const express = require('express');
const cors = require('cors');
const familyRoute = require('./src/routes/villageFamily');
const getFoldersRoute = require("./src/routes/driveImage");
const getVideoRoute = require('./src/routes/video');
const busRoute = require('./src/routes/bus');
const app = express();

app.use((req, res, next) => {
  console.log(`[INCOMING] ${req.method} ${req.url} from ${req.ip}`);
  next();
});

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(express.json());

app.use('/users', familyRoute);
app.use('/eventImage', getFoldersRoute);
app.use('/video', getVideoRoute);
app.use('/bus', busRoute);

app.get('/', (req, res) => {
  res.send('✅ Welcome to the API');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('✅ Server running on http://localhost:4000'));
