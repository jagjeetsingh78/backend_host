const Quote = require('inspirational-quotes');
const express = require('express');
const router = express.Router();



const getQuote = (req, res) => {
    try {
        const quote = Quote.getQuote();

        res.status(200).json({
            success: true,
            quote: quote.text,
            quotesAuthor: quote.author,
        });



    }catch (err) {
        res.status(500).json({ error: 'Something went wrong!' });
    }
};

router.get('/', getQuote);

module.exports = router;