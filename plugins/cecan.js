const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

function getRandomImage(folderPath, res) {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error(`Error reading folder: ${folderPath}`, err);
            return res.status(500).json({
                creator: "EMMY HENZ",
                status: 500,
                success: false,
                message: `Failed to read folder: ${folderPath}.`
            });
        }

        if (files.length === 0) {
            return res.status(404).json({
                creator: "EMMY HENZ",
                status: 404,
                success: false,
                message: `No images found in folder: ${folderPath}.`
            });
        }

        const randomImage = files[Math.floor(Math.random() * files.length)];
        const imagePath = path.join(folderPath, randomImage);

        res.sendFile(imagePath, err => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({
                    creator: "EMMY HENZ",
                    status: 500,
                    success: false,
                    message: "Failed to send the image."
                });
            }
        });
    });
}

router.get('/api/cecan-china', (req, res) => getRandomImage(path.join(__dirname, '../images/china'), res));
router.get('/api/cecan-korea', (req, res) => getRandomImage(path.join(__dirname, '../images/korea'), res));
router.get('/api/cecan-japan', (req, res) => getRandomImage(path.join(__dirname, '../images/japan'), res));
router.get('/api/cecan-indo', (req, res) => getRandomImage(path.join(__dirname, '../images/indo'), res));
router.get('/api/cecan-thailand', (req, res) => getRandomImage(path.join(__dirname, '../images/thailand'), res));
router.get('/api/cecan-vietnam', (req, res) => getRandomImage(path.join(__dirname, '../images/vietnam'), res));

module.exports = router;