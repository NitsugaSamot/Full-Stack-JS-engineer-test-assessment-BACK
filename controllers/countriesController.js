const axios = require('axios');

const getAvailableCountries = async (req, res) => {
  try {
    const response = await axios.get('https://date.nager.at/api/v3/AvailableCountries');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los países disponibles' });
  }
};


const getCountryDetails = async (req, res) => {
  const { countryCode } = req.params;
  
  try {
    // get borders information
    const bordersResponse = await axios.get(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`);
    const countryInfo = bordersResponse.data;  
    // get borders
    const borders = countryInfo.borders.map(border => ({
      commonName: border.commonName,
      officialName: border.officialName,
      countryCode: border.countryCode,
      region: border.region
    }));

    // get history poblation
    const populationResponse = await axios.post('https://countriesnow.space/api/v0.1/countries/population', {
      country: countryInfo.commonName  
    });
    const populationData = populationResponse.data.data.populationCounts;

    // get Flag
    const flagResponse = await axios.post('https://countriesnow.space/api/v0.1/countries/flag/images', {
      country: countryInfo.commonName 
    });
    const flagUrl = flagResponse.data.data.flag;

    const countryDetails = {
      commonName: countryInfo.commonName,
      officialName: countryInfo.officialName,
      countryCode: countryInfo.countryCode,
      region: countryInfo.region,
      borders,
      populationData,
      flagUrl
    };

    res.status(200).json(countryDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los detalles del país' });
  }
};


const searchCountryByName = async (req, res) => {
  const { name } = req.params;

  try {
    const response = await axios.get('https://date.nager.at/api/v3/AvailableCountries');
    const countriesData = response.data;

    const searchTerm = name.toLowerCase();

    const matchingCountries = countriesData.filter(country =>
      country.name.toLowerCase().includes(searchTerm)
    );

    if (matchingCountries.length === 0) {
      return res.status(404).json({ message: 'No se encontraron países que coincidan con la búsqueda' });
    }

    const countryDetailsPromises = matchingCountries.map(async (country) => {
      const bordersResponse = await axios.get(`https://date.nager.at/api/v3/CountryInfo/${country.countryCode}`);
      const borders = bordersResponse.data.borders;

      const populationResponse = await axios.post('https://countriesnow.space/api/v0.1/countries/population', {
        country: country.name
      });
      const populationData = populationResponse.data.data.populationCounts;

      const flagResponse = await axios.post('https://countriesnow.space/api/v0.1/countries/flag/images', {
        country: country.name
      });
      const flagUrl = flagResponse.data.data.flag;

      return {
        countryCode: country.countryCode,
        name: country.name,
        borders,
        populationData,
        flagUrl
      };
    });

    const countriesWithDetails = await Promise.all(countryDetailsPromises);

    res.status(200).json(countriesWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar detalles del país' });
  }
};
module.exports = {
  getAvailableCountries,
  getCountryDetails,
  searchCountryByName
};
