const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const jokesPath = path.join(__dirname, '../JSON/joke.json');

router.get('/api/joke', (req, res) => {
    fs.readFile(jokesPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading jokes file:', err);
            return res.set('Content-Type', 'application/json').send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 500,
                        success: false,
                        joke: "Failed to load jokes.",
                    },
                    null,
                    2 // Pretty-print with 2 spaces
                )
            );
        }

        const jokes = JSON.parse(data);
        const randomIndex = Math.floor(Math.random() * jokes.length);
        res.set('Content-Type', 'application/json').send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    joke: jokes[randomIndex].joke,
                },
                null,
                2 // Pretty-print with 2 spaces
            )
        );
    });
});

module.exports = router;