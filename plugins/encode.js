const express = require("express");
const router = express.Router();

router.get("/api/encode", (req, res) => {
    const {
        text
    } = req.query;

    if (!text || typeof text !== "string") {
        return res
            .set("Content-Type", "application/json")
            .send(
                JSON.stringify({
                        creator: "EMMY HENZ",
                        status: 400,
                        success: false,
                        message: "Invalid input. Please provide a text string using the 'text' query parameter.",
                    },
                    null,
                    2 // Pretty-print with 2 spaces
                )
            );
    }

    try {
        // Convert text to binary
        const binaryEncoded = text
            .split("")
            .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
            .join(" ");

        // Return the response with binary encoding only
        res
            .set("Content-Type", "application/json")
            .send(
                JSON.stringify({
                        creator: "EMMY HENZ",
                        status: 200,
                        success: true,
                        input: text,
                        encoded: {
                            binaryEncoded,
                        },
                    },
                    null,
                    2 // Pretty-print with 2 spaces
                )
            );
    } catch (error) {
        console.error("Error encoding text:", error);

        res
            .set("Content-Type", "application/json")
            .send(
                JSON.stringify({
                        creator: "EMMY HENZ",
                        status: 500,
                        success: false,
                        message: "Failed to encode text.",
                        error: error.message,
                    },
                    null,
                    2 // Pretty-print with 2 spaces
                )
            );
    }
});

module.exports = router;