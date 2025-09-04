/* ======  DATA  ====== */
const endpoints = [
  {
    name: "All-in-one",
    path: "/api/all-in-one?url=https://fb.com/video",
    method: "GET",
    params: ["url"],
    desc: "Download any social-media video",
    cat: "Downloaders",
  },
  {
    name: "Anime Quote",
    path: "/api/aniquote",
    method: "GET",
    params: [],
    desc: "Random quote from popular anime",
    cat: "Fun",
  },
  {
    name: "APK Downloader",
    path: "/api/apkdl?q=Facebook%20lite",
    method: "GET",
    params: ["q"],
    desc: "Download APKs directly",
    cat: "Downloaders",
  },
  {
    name: "Calculator",
    path: "/api/cal?num1=10&num2=5&operation=add",
    method: "GET",
    params: ["num1", "num2", "operation"],
    desc: "Basic arithmetic",
    cat: "Tools",
  },
  {
    name: "Country Info",
    path: "/api/country?q=Nigeria",
    method: "GET",
    params: ["q"],
    desc: "Country profiles",
    cat: "Tools",
  },
  {
    name: "Currency Converter",
    path: "/api/convert?from=USD&to=EUR&amount=100",
    method: "GET",
    params: ["from", "to", "amount"],
    desc: "Live exchange rates",
    cat: "Tools",
  },
  {
    name: "Dare",
    path: "/api/dare",
    method: "GET",
    params: [],
    desc: "Random dare challenge",
    cat: "Fun",
  },
  {
    name: "Encode",
    path: "/api/encode?text=Hello-world",
    method: "GET",
    params: ["text"],
    desc: "Text → binary",
    cat: "Tools",
  },
  {
    name: "Decode",
    path: "/api/decode?binary=01001000",
    method: "GET",
    params: ["binary"],
    desc: "Binary → text",
    cat: "Tools",
  },
  {
    name: "Facebook DL",
    path: "/api/fbdl?url=https://www.facebook.com/share/r/1JB12MKi1Z/",
    method: "GET",
    params: ["url"],
    desc: "Facebook video downloader",
    cat: "Downloaders",
  },
  {
    name: "Gpt3.5",
    path: "/api/gpt3.5?prompt=hi",
    method: "GET",
    params: ["prompt"],
    desc: "ChatGPT-3.5 turbo",
    cat: "AI",
  },
  {
    name: "TikTok DL",
    path: "/api/tkdl?url=https://vt.tiktok.com/ZSAG1bG1e/",
    method: "GET",
    params: ["url"],
    desc: "No-watermark TikTok",
    cat: "Downloaders",
  },
  {
    name: "Instagram DL",
    path: "/api/instadl?url=https://www.instagram.com/reel/DNsaHN70Cdr/?igsh=YzljYTk1ODg3Zg==",
    method: "GET",
    params: ["url"],
    desc: "Instagram media downloader",
    cat: "Downloaders",
  },
  {
    name: "YouTube MP4",
    path: "/api/ytmp4?url=URL",
    method: "GET",
    params: ["url"],
    desc: "YouTube video",
    cat: "Downloaders",
  },
  {
    name: "YouTube MP3",
    path: "/api/ytmp3?url=URL",
    method: "GET",
    params: ["url"],
    desc: "YouTube audio",
    cat: "Downloaders",
  },
  {
    name: "Text-to-Image",
    path: "/api/text2img?prompt=hello",
    method: "GET",
    params: ["prompt"],
    desc: "AI image generation",
    cat: "AI",
  },
  {
    name: "Translator",
    path: "/api/translate?text=hello&from=en&to=id",
    method: "GET",
    params: ["text", "from", "to"],
    desc: "Auto-detect translate",
    cat: "Tools",
  },
  {
    name: "Joke",
    path: "/api/joke",
    method: "GET",
    params: [],
    desc: "Random joke",
    cat: "Fun",
  },
  {
    name: "Quote",
    path: "/api/quote",
    method: "GET",
    params: [],
    desc: "Inspirational quote",
    cat: "Fun",
  },
  {
    name: "Screenshot",
    path: "/api/screenshot?url=WEBSITE",
    method: "GET",
    params: ["url"],
    desc: "Website screenshot",
    cat: "Tools",
  },
  {
    name: "TinyURL",
    path: "/api/tinyurl?url=LONG",
    method: "GET",
    params: ["url"],
    desc: "URL shortener",
    cat: "Tools",
  },
  {
    name: "Spotify DL",
    path: "/api/spotifydl?url=TRACK_URL",
    method: "GET",
    params: ["url"],
    desc: "Spotify downloader",
    cat: "Downloaders",
  },
  {
    name: "Twitter DL",
    path: "/api/twitterdl?url=https://x.com/Korsogyimi/status/1962912658618802257",
    method: "GET",
    params: ["url"],
    desc: "Twitter video downloader",
    cat: "Downloaders",
  },
  {
    name: "Pinterest Search",
    path: "/api/pinterest?q=cats",
    method: "GET",
    params: ["q"],
    desc: "Pinterest images",
    cat: "Search",
  },
  {
    name: "Wallpaper",
    path: "/api/wallpaper?q=nature",
    method: "GET",
    params: ["q"],
    desc: "HD wallpapers",
    cat: "Random",
  },
  {
    name: "Waifu (NSFW)",
    path: "/api/waifu?q=",
    method: "GET",
    params: ["q"],
    desc: "Random waifu pics",
    cat: "Random",
  },
  {
    name: "Hentai (NSFW)",
    path: "/api/hentai",
    method: "GET",
    params: [],
    desc: "Hentai videos",
    cat: "Random",
  },
  {
    name: "XXX Search",
    path: "/api/xxxsearch?q=keyword",
    method: "GET",
    params: ["q"],
    desc: "Search adult videos",
    cat: "Search",
  },
];

const baseURL = window.location.origin;

/* ======  STATE  ====== */
let filtered = [...endpoints];
let page = 0;
const perPage = 12;

/* ======  DOM  ====== */
const grid = document.getElementById("grid");
const search = document.getElementById("search");
const pills = document.getElementById("pills");
const loadBtn = document.getElementById("loadMore");
const modal = document.getElementById("modal");
const mTitle = document.getElementById("mTitle");
const mBody = document.getElementById("mBody");

/* ======  INIT  ====== */
function init() {
  createPills();
  render();
  bindEvents();
  fetchCount();
}

/* ======  CATEGORIES  ====== */
function createPills() {
  const cats = ["All", ...new Set(endpoints.map((e) => e.cat))];
  pills.innerHTML = cats
    .map((c) => `<button class="pill" data-cat="${c}">${c}</button>`)
    .join("");
  pills.firstElementChild.classList.add("active");
}

/* ======  RENDER  ====== */
function render(reset = true) {
  if (reset) {
    grid.innerHTML = "";
    page = 0;
  }
  const slice = filtered.slice(0, (page + 1) * perPage);
  slice.forEach((e) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <span class="cat">${e.cat}</span>
      <h4>${e.name}</h4>
      <p>${e.desc}</p>
      <span class="method">${e.method}</span>
    `;
    card.onclick = () => openModal(e);
    grid.appendChild(card);
  });
  loadBtn.style.display = slice.length < filtered.length ? "block" : "none";
}

/* ======  SEARCH / FILTER  ====== */
function bindEvents() {
  search.addEventListener("input", filter);
  pills.addEventListener("click", (e) => {
    if (!e.target.classList.contains("pill")) return;
    pills.querySelector(".active")?.classList.remove("active");
    e.target.classList.add("active");
    filter();
  });
  loadBtn.addEventListener("click", () => {
    page++;
    render(false);
  });
  modal.querySelector(".modal-close").onclick = closeModal;
  modal.querySelector(".modal-backdrop").onclick = closeModal;
}

function filter() {
  const term = search.value.toLowerCase();
  const cat = pills.querySelector(".active").dataset.cat;
  filtered = endpoints.filter(
    (e) =>
      (cat === "All" || e.cat === cat) &&
      (e.name.toLowerCase().includes(term) ||
        e.desc.toLowerCase().includes(term)),
  );
  render();
}

/* ======  MODAL  ====== */
function openModal(e) {
  mTitle.textContent = e.name;
  const url = `${baseURL}${e.path}`;
  mBody.innerHTML = `
    <p>${e.desc}</p>
    <p><strong>Method:</strong> ${e.method}</p>
    ${e.params.length ? `<p><strong>Params:</strong> ${e.params.join(", ")}</p>` : ""}
    <div class="code-snippet">curl -X ${e.method} "${url}"</div>
    <div style="margin-top:1rem">
      <button class="btn-copy" onclick="navigator.clipboard.writeText('${url}')">Copy URL</button>
      <a href="${url}" target="_blank" style="margin-left:.5rem" class="btn-copy">Test</a>
    </div>
  `;
  modal.classList.add("active");
}
function closeModal() {
  modal.classList.remove("active");
}

/* ======  LIVE REQUEST COUNT  ====== */
async function fetchCount() {
  try {
    const res = await fetch(`${baseURL}/api/requests`);
    const data = await res.json();
    document.getElementById("req-count").textContent =
      data.request_count.toLocaleString();
  } catch {
    document.getElementById("req-count").textContent = "0";
  }
}

/* ======  UTILS  ====== */
window.scrollToSection = (id) =>
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });

init();
