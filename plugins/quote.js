const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const quotesPath = path.join(__dirname, '../JSON/quote.json');

router.get('/api/quote', (req, res) => {
    fs.readFile(quotesPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading quotes file:', err);
            return res.set('Content-Type', 'application/json').send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 500,
                        success: false,
                        Author: null,
                        quote: "Failed to load quotes.",
                    },
                    null,
                    2 // Pretty-print with 2 spaces
                )
            );
        }

        const quotes = JSON.parse(data);
        const randomIndex = Math.floor(Math.random() * quotes.length);
        res.set('Content-Type', 'application/json').send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    Author: quotes[randomIndex].author,
                    quote: quotes[randomIndex].quote,
                },
                null,
                2 // Pretty-print with 2 spaces
            )
        );
    });
});

module.exports = router;