const fs = require("fs");
const path = require("path");
const cors = require("cors");
const express = require("express");


const countryPlug = require('./plugins/country');
const cecanPlug = require('./plugins/cecan');
const darePlug = require('./plugins/dare');
const truthPlug = require('./plugins/truth');
const aniquotePlug = require('./plugins/aniquote');
const flirtPlug = require('./plugins/flirt');
const calPlug = require('./plugins/calculator');
const convertPlug = require('./plugins/convert');
const rizzPlug = require('./plugins/rizz');
const quotePlug = require('./plugins/quote');
const encodePlug = require('./plugins/encode');
const decodePlug = require('./plugins/decoder');
const waifuPlug = require('./plugins/waifu');
const jokePlug = require('./plugins/joke');
const obfPlug = require('./plugins/obf');
const tinyurlPlug = require('./plugins/tinyurl');
const ytmp3Plug = require('./plugins/ytmp3');
const ytmp4Plug = require('./plugins/ytmp4');
const tiktokPlug = require('./plugins/tiktok');
const ytsPlug = require('./plugins/yts');
const wachannelPlug = require('./plugins/wachannel')
const animedlPlug = require('./plugins/animedl');
const xvidPlug = require('./plugins/xvideos');
const hentaiPlug = require('./plugins/hentai');
const npmcheckPlug = require('./plugins/npmcheck');
const wallpaperPlugin = require('./plugins/wallpaper');
const xsearchPlug = require('./plugins/xxxsearch');
const screenshotPlug = require('./plugins/screenshot');
const text2imagePlug = require('./plugins/text2image');
const fontPlug = require('./plugins/font');
const lyricsPlug  = require('./plugins/lyrics');
const mediafirePlug = require('./plugins/mediafire');
const xnxxsearchPlug = require('./plugins/xnxxsearch');
const moviedlPlug = require('./plugins/moviedl');
const gpt3_5Plug = require('./plugins/gpt3.5');
const instaplug = require('./plugins/instagram');
const fbPlug = require('./plugins/facebook');
const twitterPlug = require('./plugins/twitter');
const spotifyPlug = require('./plugins/spotify');
const aioPlug = require('./plugins/all-in-one');
const shortclipPlug = require('./plugins/shortclip');
const pinterestPlug = require('./plugins/pinterest');
const apkdlPlug = require('./plugins/apkdl');
const threadPlug = require('./plugins/thread');
const translatePlug = require('./plugins/translate');

const blue = express();
const PORT = process.env.PORT || 7860;

// Middleware
blue.use(cors());
blue.use(express.json());
blue.use(express.static(path.join(__dirname, "public")));

function getRequestCount() {
    try {
        const data = fs.readFileSync('requests.json', 'utf8');
        return JSON.parse(data).count;
    } catch (error) {
        return 0;
    }
}
function updateRequestCount(count) {
    fs.writeFileSync('requests.json', JSON.stringify({ count }));
}
blue.use((req, res, next) => {
    const currentCount = getRequestCount();
    updateRequestCount(currentCount + 1);
    next();
});
/*====================================*/
blue.use(countryPlug);
blue.use(cecanPlug);
blue.use(jokePlug);
blue.use(darePlug);
blue.use(truthPlug);
blue.use(aniquotePlug);
blue.use(calPlug);
blue.use(flirtPlug);
blue.use(convertPlug);
blue.use(rizzPlug);
blue.use(quotePlug);
blue.use(encodePlug);
blue.use(decodePlug);
blue.use(waifuPlug);
blue.use(obfPlug);
blue.use(tinyurlPlug);
blue.use(ytmp3Plug);
blue.use(ytmp4Plug);
blue.use(tiktokPlug);
blue.use(ytsPlug);
blue.use(wachannelPlug);
blue.use(animedlPlug);
blue.use(xvidPlug);
blue.use(hentaiPlug);
blue.use(npmcheckPlug);
blue.use(wallpaperPlugin);
blue.use(xsearchPlug);
blue.use(screenshotPlug);
blue.use(text2imagePlug);
blue.use(fontPlug);
blue.use(lyricsPlug);
blue.use(mediafirePlug);
blue.use(xnxxsearchPlug);
blue.use(moviedlPlug);
blue.use(gpt3_5Plug);
blue.use(instaplug);
blue.use(fbPlug);
blue.use(twitterPlug);
blue.use(spotifyPlug);
blue.use(aioPlug);
blue.use(shortclipPlug);
blue.use(pinterestPlug);
blue.use(apkdlPlug);
blue.use(threadPlug);
blue.use(translatePlug);
/*====================================*/
const requestsFilePath = path.join(__dirname, 'requests.json');
blue.get('/api/requests', (req, res) => {
    if (fs.existsSync(requestsFilePath)) {
        const data = JSON.parse(fs.readFileSync(requestsFilePath, 'utf8'));
        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 200,
                    success: true,
                    request_count: data.count,
                },
                null,
                2 // Pretty-print with 2 spaces
            )
        );
    } else {
        res.set("Content-Type", "application/json").send(
            JSON.stringify(
                {
                    creator: "EMMY HENZ",
                    status: 500,
                    success: false,
                    message: "Failed to read request count.",
                },
                null,
                2
            )
        );
    }
});
blue.get("/api", (req, res) => {
    const requestCount = getRequestCount();
    res.set("Content-Type", "application/json").send(
        JSON.stringify(
            {
                creator: "EMMY HENZ",
                status: 200,
                success: true,
                message: "Welcome to the Combined API!",
                totalRequests: requestCount
            },
            null,
            2
        )
    );
});

// Catch-All for Undefined Routes (404)
blue.use((req, res) => {
    res.status(404).set("Content-Type", "application/json").send(
        JSON.stringify(
            {
                creator: "EMMY HENZ",
                status: 404,
                success: false,
                message: "Endpoint not found. Please check the URL and try again.",
            },
            null,
            2
        )
    );
});
blue.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(500).set("Content-Type", "application/json").send(
        JSON.stringify(
            {
                creator: "EMMY HENZ",
                status: 500,
                success: false,
                message: "An unexpected error occurred. Please try again later.",
                error: err.message,
            },
            null,
            2
        )
    );
});

// Start the Server
blue.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});