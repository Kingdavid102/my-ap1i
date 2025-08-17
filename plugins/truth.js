const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const truthsPath = path.join(__dirname, '../JSON/truth.json');

router.get('/api/truth', (req, res) => {
    fs.readFile(truthsPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading truths file:', err);
            return res.set('Content-Type', 'application/json').send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 500,
                        success: false,
                        truth: "Failed to load truths.",
                    },
                    null,
                    2 // Pretty-print with 2 spaces
                )
            );
        }

        const truths = JSON.parse(data);
        const randomIndex = Math.floor(Math.random() * truths.length);
        res.set('Content-Type', 'application/json').send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    truth: truths[randomIndex].truth,
                },
                null,
                2 // Pretty-print with 2 spaces
            )
        );
    });
});

module.exports = router;