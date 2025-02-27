const express = require("express");
const axios = require("axios");

const app = express();
const port = 8090;

app.use(express.json()); // Middleware to parse JSON request body

const GEO_API_KEY = process.env.GEO_API_KEY;

//const ALLOWED_COUNTRY_CODE = "LK"; // Hard coded for now

app.post("/risk", async (req, res) => {
    try {
        const { ip, country } = req.body;

        if (!ip || country) {
            return res.status(400).json({ error: "IP address and country name is required" });
        }

        // Call the IP Geolocation API
        const response = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${GEO_API_KEY}&ip=${ip}&fields=country_name`);

        const country_name = response.data.country_name;

        // Determine risk based on country code
        const hasRisk = country_name !== country;

        res.json({ hasRisk });

    } catch (error) {
        console.error("Error fetching IP geolocation:", error.message);
        res.status(500).json({ error: "Failed to process request" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});