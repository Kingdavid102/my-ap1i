const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const quotesPath = path.join(__dirname, '../JSON/aniquote.json');

router.get('/api/aniquote', (req, res) => {
    fs.readFile(quotesPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading anime quotes file:', err);
            return res.set('Content-Type', 'application/json').send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 500,
                        success: false,
                        author: null,
                        quote: "Failed to load anime quotes.",
                    },
                    null,
                    2
                )
            );
        }

        const quotes = JSON.parse(data);
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];

        res.set('Content-Type', 'application/json').send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    author: randomQuote.author,
                    anime: randomQuote.anime,
                    quote: randomQuote.quote,
                },
                null,
                2
            )
        );
    });
});

module.exports = router;