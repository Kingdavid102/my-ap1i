const express = require("express");
const router = express.Router();

router.get("/api/decode", (req, res) => {
    const {
        binary
    } = req.query;

    if (!binary || typeof binary !== "string") {
        return res
            .set("Content-Type", "application/json")
            .send(
                JSON.stringify({
                        creator: "EMMY HENZ",
                        status: 400,
                        success: false,
                        message: "Invalid input. Please provide binary-encoded text using the 'binary' query parameter.",
                    },
                    null,
                    2 // Pretty-print with 2 spaces
                )
            );
    }

    try {
        // Convert binary back to text
        const decodedText = binary
            .split(" ")
            .map((binaryChar) => String.fromCharCode(parseInt(binaryChar, 2)))
            .join("");

        // Return the decoded text
        res
            .set("Content-Type", "application/json")
            .send(
                JSON.stringify({
                        creator: "EMMY HENZ",
                        status: 200,
                        success: true,
                        binary: binary,
                        decoded: decodedText,
                    },
                    null,
                    2 // Pretty-print with 2 spaces
                )
            );
    } catch (error) {
        console.error("Error decoding binary:", error);

        res
            .set("Content-Type", "application/json")
            .send(
                JSON.stringify({
                        creator: "EMMY HENZ",
                        status: 500,
                        success: false,
                        message: "Failed to decode binary text.",
                        error: error.message,
                    },
                    null,
                    2 // Pretty-print with 2 spaces
                )
            );
    }
});

module.exports = router;