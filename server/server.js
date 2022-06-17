/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const requestsRoutes = require('./routes/requests.js');
const citiesRoutes = require('./routes/cities.js');
const autoRoutes = require('./routes/auto.js');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

app.use('/requests', requestsRoutes);
app.use('/dictionary/cities', citiesRoutes);
app.use('/dictionary/auto', autoRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})