const express = require('express');
const router = express.Router();

router.get('/api/cal', (req, res) => {
    const { num1, num2, operation } = req.query;

    // Validate input
    if (!num1 || !num2 || !operation) {
        return res
            .status(400)
            .set('Content-Type', 'application/json')
            .send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 400,
                        success: false,
                        message: "Missing parameters. Please provide 'num1', 'num2', and 'operation'.",
                    },
                    null,
                    2 // Pretty-print with 2 spaces
                )
            );
    }

    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);

    if (isNaN(number1) || isNaN(number2)) {
        return res
            .status(400)
            .set('Content-Type', 'application/json')
            .send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 400,
                        success: false,
                        message: "Invalid numbers. Please provide valid numeric values for 'num1' and 'num2'.",
                    },
                    null,
                    2
                )
            );
    }

    let result;
    switch (operation) {
        case 'add':
            result = number1 + number2;
            break;
        case 'subtract':
            result = number1 - number2;
            break;
        case 'multiply':
            result = number1 * number2;
            break;
        case 'divide':
            if (number2 === 0) {
                return res
                    .status(400)
                    .set('Content-Type', 'application/json')
                    .send(
                        JSON.stringify(
                            {
                                creator: "EMMY HENZ",
                                status: 400,
                                success: false,
                                message: "Division by zero is not allowed.",
                            },
                            null,
                            2
                        )
                    );
            }
            result = number1 / number2;
            break;
        default:
            return res
                .status(400)
                .set('Content-Type', 'application/json')
                .send(
                    JSON.stringify(
                        {
                            creator: "EMMY HENZ",
                            status: 400,
                            success: false,
                            message: "Invalid operation. Supported operations are 'add', 'subtract', 'multiply', and 'divide'.",
                        },
                        null,
                        2
                    )
                );
    }

    res.status(200)
        .set('Content-Type', 'application/json')
        .send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    operation,
                    num1: number1,
                    num2: number2,
                    result,
                },
                null,
                2
            )
        );
});

module.exports = router;