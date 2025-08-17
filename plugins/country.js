const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/api/country', async (req, res) => {
    const query = req.query.q ? req.query.q.toLowerCase() : null;

    if (!query) {
        return res.status(400).set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide a country name using the 'q' parameter."
                },
                null,
                2
            )
        );
    }

    try {
        const response = await axios.get(`https://restcountries.com/v3.1/name/${query}`);
        const country = response.data[0];

        const countryData = {
            creator: "EMMY HENZ",
            status: 200,
            success: true,
            searchMetadata: {
                originalQuery: query,
                matchedCountry: country.name.common,
                similarity: 1
            },
            data: {
                name: country.name.common,
                capital: country.capital ? country.capital[0] : "N/A",
                flag: country.flags.png,
                phoneCode: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ""),
                googleMapsLink: country.maps.googleMaps,
                continent: {
                    code: country.region.toLowerCase().slice(0, 2),
                    name: country.region,
                    emoji: "🌍"
                },
                coordinates: {
                    latitude: country.latlng[0],
                    longitude: country.latlng[1]
                },
                area: {
                    squareKilometers: country.area,
                    squareMiles: (country.area * 0.3861).toFixed(2)
                },
                landlocked: country.landlocked,
                languages: {
                    native: Object.values(country.languages),
                    codes: Object.keys(country.languages)
                },
                famousFor: "N/A", // Placeholder for famous information
                constitutionalForm: "N/A", // Placeholder for constitutional form
                neighbors: country.borders ? country.borders.map(border => ({
                    name: border,
                    flag: `https://github.com/djaiss/mapsicon/blob/master/all/${border.toLowerCase()}/1024.png?raw=true`,
                    coordinates: null
                })) : [],
                currency: Object.values(country.currencies).map(curr => curr.name).join(", "),
                drivingSide: country.car.side,
                alcoholProhibition: "N/A", // Customize as needed
                internetTLD: country.tld[0],
                isoCode: {
                    numeric: country.ccn3,
                    alpha2: country.cca2,
                    alpha3: country.cca3
                }
            }
        };

        res.status(200).set("Content-Type", "application/json").send(JSON.stringify(countryData, null, 2));
    } catch (error) {
        console.error('Error fetching country data:', error.message);
        res.status(404).set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 404,
                    success: false,
                    message: `No data found for country: ${query}`
                },
                null,
                2
            )
        );
    }
});

module.exports = router;