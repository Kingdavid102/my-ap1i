const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const flirtFilePath = path.join(__dirname, '../JSON/flirt.json');

// API to get a random flirty sentence
router.get('/api/flirt', (req, res) => {
    fs.readFile(flirtFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading flirting file:', err);
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 500,
                        success: false,
                        message: "Failed to load flirting sentences."
                    },
                    null,
                    2 // Pretty-print with 2 spaces
                )
            );
        }

        const flirtingSentences = JSON.parse(data);
        const randomIndex = Math.floor(Math.random() * flirtingSentences.length);
        const randomFlirt = flirtingSentences[randomIndex];

        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    flirt: randomFlirt
                },
                null,
                2 // Pretty-print with 2 spaces
            )
        );
    });
});

module.exports = router;