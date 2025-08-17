const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

router.get('/api/mediafire', async (req, res) => {
    const mediafireUrl = req.query.url;

    if (!mediafireUrl || !mediafireUrl.startsWith("https://www.mediafire.com/")) {
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 400,
                    success: false,
                    message: "Please provide a valid MediaFire file URL using the 'url' query parameter."
                },
                null,
                2
            )
        );
    }

    try {
        const translatedUrl = `https://www-mediafire-com.translate.goog/${mediafireUrl.replace('https://www.mediafire.com/', '')}?_x_tr_sl=en&_x_tr_tl=fr&_x_tr_hl=en&_x_tr_pto=wapp`;
        const response = await axios.get(translatedUrl);
        const $ = cheerio.load(response.data);

        const downloadLink = $('#downloadButton').attr('href');
        const fileName = $('body > main > div.content > div.center > div > div.dl-btn-cont > div.dl-btn-labelWrap > div.promoDownloadName.notranslate > div')
            .attr('title')
            ?.trim()
            ?.replace(/\s+/g, '');
        const uploadDate = $('body > main > div.content > div.center > div > div.dl-info > ul > li:nth-child(2) > span').text();
        const fileSize = $('#downloadButton').text().replace('Download', '').replace(/[()\n\s]+/g, '');
        
        let mimeType = '';
        if (downloadLink) {
            const headResponse = await axios.head(downloadLink);
            mimeType = headResponse.headers['content-type'];
        }

        if (!downloadLink) {
            return res.set("Content-Type", "application/json").send(
                JSON.stringify(
                    {
                        creator: "EMMY HENZ",
                        status: 404,
                        success: false,
                        message: "Download link not found. The file may have been removed or the URL is incorrect."
                    },
                    null,
                    2
                )
            );
        }

        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    file_name: fileName || "Unknown",
                    file_size: fileSize || "Unknown",
                    upload_date: uploadDate || "Unknown",
                    mime_type: mimeType || "Unknown",
                    download_link: downloadLink
                },
                null,
                2
            )
        );
    } catch (error) {
        console.error("❌ Error:", error.message);
        return res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 500,
                    success: false,
                    message: "An error occurred while processing the MediaFire link.",
                    error: error.message
                },
                null,
                2
            )
        );
    }
});

module.exports = router;