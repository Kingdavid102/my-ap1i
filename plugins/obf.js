const express = require('express');
const JsConfuser = require('js-confuser');

const router = express.Router();

router.get('/api/obf', async (req, res) => {
    const code = req.query.code;

    if (!code || typeof code !== 'string') {
        return res.set('Content-Type', 'application/json').send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Invalid input. Please provide JavaScript code as a 'code' query parameter.",
                    obfuscatedCode: null,
                },
                null,
                2 // Pretty-print with 2 spaces
            )
        );
    }

    try {
        const obfuscated = await JsConfuser.obfuscate(code, {
            target: "node",
            preset: "high",
            stringEncoding: false,
        });

        res.set('Content-Type', 'application/json').send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    originalCode: code,
                    obfuscatedCode: obfuscated.code,
                },
                null,
                2 // Pretty-print with 2 spaces
            )
        );
    } catch (error) {
        console.error("Error obfuscating code:", error);
        res.set('Content-Type', 'application/json').send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 500,
                    success: false,
                    message: "Failed to obfuscate the code.",
                    error: error.message,
                },
                null,
                2 // Pretty-print with 2 spaces
            )
        );
    }
});

module.exports = router;