const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const darePath = path.join(__dirname, '../JSON/dare.json');

router.get('/api/dare', (req, res) => {
    fs.readFile(darePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading dare file:', err);
            return res.set('Content-Type', 'application/json').send(
                JSON.stringify({
                        creator: "EMMY HENZ",
                        status: 500,
                        success: false,
                        dare: "Failed to load dares.",
                    },
                    null,
                    2 // Pretty-print with 2 spaces
                )
            );
        }

        const dares = JSON.parse(data);
        const randomIndex = Math.floor(Math.random() * dares.length);
        res.set('Content-Type', 'application/json').send(
            JSON.stringify({
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    dare: dares[randomIndex].dare,
                },
                null,
                2 // Pretty-print with 2 spaces
            )
        );
    });
});

module.exports = router;