const express = require('express');
const axios = require('axios');

const router = express.Router();

const apiKey = '43f31fb84c391ced11b216a4';  // Replace with your own API key if needed

router.get('/api/convert', async (req, res) => {
    const fromCurrency = req.query.from;
    const toCurrency = req.query.to;
    const amount = parseFloat(req.query.amount);

    if (!fromCurrency || !toCurrency || isNaN(amount) || amount <= 0) {
        return res.status(400).set('Content-Type', 'application/json').send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Invalid input. Please provide 'from', 'to', and a positive 'amount' as query parameters.",
                },
                null,
                2
            )
        );
    }

    try {
        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}`;
        const response = await axios.get(url);
        const exchangeRate = response.data.conversion_rate;

        if (exchangeRate) {
            const convertedAmount = (amount * exchangeRate).toFixed(2);

            res.status(200).set('Content-Type', 'application/json').send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 200,
                        success: true,
                        from_currency: fromCurrency,
                        to_currency: toCurrency,
                        amount: amount,
                        exchange_rate: exchangeRate,
                        converted_amount: convertedAmount,
                    },
                    null,
                    2
                )
            );
        } else {
            res.status(500).set('Content-Type', 'application/json').send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 500,
                        success: false,
                        message: "Failed to retrieve the exchange rate. Please try again later.",
                    },
                    null,
                    2
                )
            );
        }
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        res.status(500).set('Content-Type', 'application/json').send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 500,
                    success: false,
                    message: "An unexpected error occurred. Please try again later.",
                    error: error.message,
                },
                null,
                2
            )
        );
    }
});

module.exports = router;