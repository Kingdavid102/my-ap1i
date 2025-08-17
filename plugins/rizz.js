const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const rizzPath = path.join(__dirname, '../JSON/rizz.json');

router.get('/api/rizz', (req, res) => {
    fs.readFile(rizzPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading rizz file:', err);
            return res.set('Content-Type', 'application/json').send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 500,
                        success: false,
                        rizz: "Failed to load rizz lines.",
                    },
                    null,
                    2
                )
            );
        }

        const rizz = JSON.parse(data);
        const randomIndex = Math.floor(Math.random() * rizz.length);
        res.set('Content-Type', 'application/json').send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    rizz: rizz[randomIndex].rizz,
                },
                null,
                2
            )
        );
    });
});

module.exports = router;