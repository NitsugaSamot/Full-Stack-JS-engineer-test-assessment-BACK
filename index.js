const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const countriesRoutes = require('./routes/countries');

dotenv.config();

const app = express();

const allowedDomains = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedDomains.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
};


app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', countriesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
