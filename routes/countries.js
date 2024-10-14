const express = require('express');
const { getAvailableCountries, getCountryDetails, searchCountryByName } = require('../controllers/countriesController');

const router = express.Router();

router.get('/', getAvailableCountries);

router.get('/:countryCode', getCountryDetails);
router.get('/search/:name', searchCountryByName);

module.exports = router;
