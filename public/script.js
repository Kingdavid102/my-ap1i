const endpoints = [
  {
    name: "Anime Downloader",
    path: "/api/animedl?name=solo%20leveling&episode=1",
    method: "GET",
    params: ["name", "episode"],
    description: "Download any anime series with ease",
    category: "Downloaders",
  },
  {
    name: "All-in-one",
    path: "/api/all-in-one?url=https://www.facebook.com/DeadWithDerrSter/videos/951658963655313/",
    method: "GET",
    params: ["url"],
    description: "Download any social media video",
    category: "Downloaders",
  },
  {
    name: "Anime Quote",
    path: "/api/aniquote",
    method: "GET",
    params: [],
    description: "Get a Random quote from popular anime series",
    category: "Fun",
  },
  {
    name: "APK Downloader",
    path: "/api/apkdl?q=Facebook%20lite",
    method: "GET",
    params: ["q"],
    description: "Endpoint for app downloader",
    category: "Downloaders",
  },
  {
    name: "Calculator",
    path: "/api/cal?num1=10&num2=5&operation=add",
    method: "GET",
    params: ["num1", "num2", "operation"],
    description: "Perform basic arithmetic operations",
    category: "Tools",
  },
  {
    name: "Country",
    path: "/api/country?q=Nigeria",
    method: "GET",
    params: ["q"],
    description: "Search for countries info",
    category: "Tools",
  },
  {
    name: "Currency Converter",
    path: "/api/convert?from=USD&to=EUR&amount=100",
    method: "GET",
    params: ["from", "to", "amount"],
    description: "Convert currencies with real-time exchange rates",
    category: "Tools",
  },
  {
    name: "Dare",
    path: "/api/dare",
    method: "GET",
    params: [],
    description: "Get a Random dare challenge",
    category: "Fun",
  },
  {
    name: "Encode",
    path: "/api/encode?text=Hello-world",
    method: "GET",
    params: ["text"],
    description: "Encode text to binary",
    category: "Tools",
  },
  {
    name: "Decode",
    path: "/api/decode?binary=01001000 01101001",
    method: "GET",
    params: ["binary"],
    description: "Decode binary to text",
    category: "Tools",
  },
  {
    name: "Font",
    path: "/api/font?text=Blue%20demon",
    method: "GET",
    params: ["text"],
    description: "Generate different fonts ",
    category: "Tools",
  },
  {
    name: "Facebook",
    path: "/api/fbdl?url=https://www.facebook.com/share/v/12En5xB3SQk/",
    method: "GET",
    params: ["url"],
    description: "Facebook video downloader",
    category: "Downloaders",
  },
  {
    name: "Gpt3.5",
    path: "/api/gpt3.5?prompt=hi",
    method: "GET",
    params: ["prompt"],
    description: "advance chatbot artificial intelligence",
    category: "Ai",
  },
  {
    name: "Waifu",
    path: "/api/waifu?q=",
    method: "GET",
    params: ["q"],
    description: "Get a Random waifu image (NSFW)",
    category: "Search",
  },
  {
    name: "Hentai",
    path: "/api/hentai",
    method: "GET",
    params: [],
    description: "Get a Random hentai videos (NSFW)",
    category: "Random",
  },
  {
    name: "Mediafire",
    path: "/api/mediafire?url=https://www.mediafire.com/file/2s3pdn53o12ug5a/%25E2%2588%2582%25C9%259B%25C6%25A8%25D1%2582%25D1%258F%25CA%258Bc%25D1%2582%25CE%25B9%25CF%2583%25D0%25B8%25CF%2587-2.zip/file",
    method: "GET",
    params: ["url"],
    description: "automated mediafire downloader",
    category: "Downloaders",
  },
  {
    name: "Pinterest",
    path: "/api/pinterest?q=fat%20ass",
    method: "GET",
    params: ["q"],
    description: "Get Pinterest image via search query",
    category: "Search",
  },
  {
    name: "Text2image",
    path: "/api/text2img?prompt=a%20big%20dog%20and%20a%20tiny%20cat",
    method: "GET",
    params: ["prompt"],
    description: "Generate an HD image via text prompt",
    category: "Ai",
  },
  {
    name: "Translator",
    path: "/api/translate?text=hello%20how%20are%20you&from=en&to=id",
    method: "GET",
    params: ["text"],
    description: "Translate from any language to another",
    category: "Tools",
  },
  {
    name: "Twitter / X",
    path: "/api/twitterdl?url=https://x.com/dammiedammie35/status/1897584097083400456?t=zU0X4PZDLQswYHbDCxi6Ng&s=09",
    method: "GET",
    params: ["url"],
    description: "Twitter video downloader",
    category: "Downloaders",
  },
  {
    name: "Instagram",
    path: "/api/instadl?url=https://www.instagram.com/reel/DBlb0Q8vxjD/?utm_source=ig_web_copy_link",
    method: "GET",
    params: ["url"],
    description: "Instagram video downloader",
    category: "Downloaders",
  },
  {
    name: "Joke",
    path: "/api/joke",
    method: "GET",
    params: [],
    description: "Get a Random joke to make you laugh",
    category: "Fun",
  },
  {
    name: "NpmCheck",
    path: "/api/npmcheck?package=express",
    method: "GET",
    params: ["package"],
    description: "Check any npmpackage details",
    category: "Search",
  },
  {
    name: "Movie downloader",
    path: "/api/moviedl?moviename=moana&episode=",
    method: "GET",
    params: ["moviename", "episode"],
    description: "search and download different movies",
    category: "Downloaders",
  },
  {
    name: "lyrics",
    path: "/api/lyrics?q=not%20like%20us",
    method: "GET",
    params: ["q"],
    description: "automated lyrics search",
    category: "Search",
  },
  {
    name: "Obfuscate",
    path: "/api/obf?code=console.log('hello');",
    method: "GET",
    params: ["code"],
    description: "Obfuscate your JavaScript code",
    category: "Tools",
  },
  {
    name: "Quote",
    path: "/api/quote",
    method: "GET",
    params: [],
    description: "Get an inspirational quote to brighten your day",
    category: "Fun",
  },
  {
    name: "Rizz",
    path: "/api/rizz",
    method: "GET",
    params: [],
    description: "Get a Random pickup line to impress your crush",
    category: "Fun",
  },
  {
    name: "wallpaper",
    path: "/api/wallpaper?q=naruto",
    method: "GET",
    params: ["q"],
    description: "generates cool wallpapers",
    category: "Random",
  },
  {
    name: "Web Screenshot",
    path: "/api/screenshot?url=https://api-xx-xi.hf.space/",
    method: "GET",
    params: ["url"],
    description: "Take a screenshot of any website via url",
    category: "Tools",
  },
  {
    name: "Spotify",
    path: "/api/spotifydl?url=https://open.spotify.com/track/1r3yPRzWPxM4O0S1T8X6vx?si=1NSDkaZxRjW-dDMcn14V7g",
    method: "GET",
    params: ["url"],
    description: "Download Spotify music via link",
    category: "Downloaders",
  },
  {
    name: "short movie clips",
    path: "/api/shortclip?q=moana",
    method: "GET",
    params: ["q"],
    description: "Get clips of any movie available",
    category: "Search",
  },
  {
    name: "Thread Downloader",
    path: "/api/threaddl?url=https://www.threads.net/@ekene_umenwa/post/DHL9gkgsZct?xmt=AQGzXGz-1ax86LccgoJoIaOR5xDXKhGxZwMB1HAkIr3yRw",
    method: "GET",
    params: ["url"],
    description: "Download Thread video/images without watermark",
    category: "Downloaders",
  },
  {
    name: "TikTok Downloader",
    path: "/api/tkdl?url=https://vm.tiktok.com/ZMknsbayE/",
    method: "GET",
    params: ["url"],
    description: "Download TikTok videos without watermark",
    category: "Downloaders",
  },
  {
    name: "XVideos Downloader",
    path: "/api/xvideos?url=https://www.xvideos.com/video.udvpliv122f/the_best_videos_of_hot_stepmom_alexa_payne",
    method: "GET",
    params: ["url"],
    description: "Download xvidos without premium access",
    category: "Downloaders",
  },
  {
    name: "Xxx videos Search",
    path: "/api/xxxsearch?q=big%20fat%20ass",
    method: "GET",
    params: ["q"],
    description: "Search xvideos with ease",
    category: "Search",
  },
  {
    name: "Xnxx video Search",
    path: "/api/xnxxsearch?q=big%20fat%20ass",
    method: "GET",
    params: ["q"],
    description: "Search xnxx videos with ease",
    category: "Search",
  },
  {
    name: "TinyURL",
    path: "/api/tinyurl?url=https://api-x-demon-dev.hf.space",
    method: "GET",
    params: ["url"],
    description: "Shorten long URLs for easy sharing",
    category: "Tools",
  },
  {
    name: "Truth",
    path: "/api/truth",
    method: "GET",
    params: [],
    description: "Get a Random truth question for your game night",
    category: "Fun",
  },
  {
    name: "Flirt",
    path: "/api/flirt",
    method: "GET",
    params: [],
    description: "Get a Random flirting words for your crush😉",
    category: "Fun",
  },
  {
    name: "Wachannel info",
    path: "/api/wachannel?url=https://whatsapp.com/channel/0029Vah3fKtCnA7oMPTPJm1h",
    method: "GET",
    params: ["url"],
    description: "check WhatsApp channel info via link",
    category: "Tools",
  },
  {
    name: "YouTube MP3",
    path: "/api/ytmp3?url=https://youtu.be/wf_s7OIfHyw?si=yJSInCsXUVgHrH4t&qua=256",
    method: "GET",
    params: ["url"],
    description: "Convert YouTube videos to MP3 audio",
    category: "Downloaders",
  },
  {
    name: "YouTube MP4",
    path: "/api/ytmp4?url=https://youtu.be/wf_s7OIfHyw?si=yJSInCsXUVgHrH4t",
    method: "GET",
    params: ["url"],
    description: "Download YouTube videos in MP4 format",
    category: "Downloaders",
  },
  {
    name: "YouTube Search",
    path: "/api/yts?q=demon-slayers",
    method: "GET",
    params: ["q"],
    description: "Search for YouTube videos and get detailed information",
    category: "Search",
  },
  {
    name: "cecan-china",
    path: "/api/cecan-china",
    method: "GET",
    params: [],
    description: "Get a Random Chinese women image",
    category: "Random",
  },
  {
    name: "cecan-indo",
    path: "/api/cecan-indo",
    method: "GET",
    params: [],
    description: "Get a Random Indonesian women image",
    category: "Random",
  },
  {
    name: "cecan-japan",
    path: "/api/cecan-japan",
    method: "GET",
    params: [],
    description: "Get a Random Japanese women image",
    category: "Random",
  },
  {
    name: "cecan-korea",
    path: "/api/cecan-korea",
    method: "GET",
    params: [],
    description: "Get a Random Korean women image",
    category: "Random",
  },
  {
    name: "cecan-thailand",
    path: "/api/cecan-thailand",
    method: "GET",
    params: [],
    description: "Get a Random Thai women image",
    category: "Random",
  },
  {
    name: "cecan-vietnam",
    path: "/api/cecan-vietnam",
    method: "GET",
    params: [],
    description: "Get a Random Vietnamese women image",
    category: "Random",
  },
]

// Create a function to populate the category list
function createCategoryList() {
  const categoryList = document.getElementById("categoryList")
  const categories = [...new Set(endpoints.map((endpoint) => endpoint.category))]

  // Add "All" category at the beginning
  const allCategory = document.createElement("li")
  const allLink = document.createElement("a")
  allLink.href = "#"
  allLink.textContent = "All"
  allLink.addEventListener("click", (e) => {
    e.preventDefault()
    filterEndpoints("All")
    highlightActiveCategory(allLink)
  })
  allCategory.appendChild(allLink)
  categoryList.appendChild(allCategory)

  // Add all other categories
  categories.forEach((category) => {
    const li = document.createElement("li")
    const a = document.createElement("a")
    a.href = "#"
    a.textContent = category
    a.addEventListener("click", (e) => {
      e.preventDefault()
      filterEndpoints(category)
      highlightActiveCategory(a)
    })
    li.appendChild(a)
    categoryList.appendChild(li)
  })
}

// Function to highlight active category
function highlightActiveCategory(activeLink) {
  document.querySelectorAll("#categoryList a").forEach((link) => {
    link.classList.remove("active")
  })

  activeLink.classList.add("active")
}

// Filter endpoints by category
function filterEndpoints(category) {
  const filteredEndpoints =
    category === "All" ? endpoints : endpoints.filter((endpoint) => endpoint.category === category)

  createEndpointCards(filteredEndpoints)

  // Scroll to endpoints section with animation
  document.getElementById("endpoints").scrollIntoView({ behavior: "smooth" })
}

// Add 3D tilt effect to cards
function addTiltEffect(element) {
  element.addEventListener("mousemove", (e) => {
    const rect = element.getBoundingClientRect()
    const x = e.clientX - rect.left // x position within the element
    const y = e.clientY - rect.top // y position within the element

    // Calculate the position for the 3D effect
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const percentX = ((x - centerX) / centerX) * 15 // -15 to 15
    const percentY = ((y - centerY) / centerY) * 15 // -15 to 15

    // Apply a subtle transform based on mouse position
    element.style.transform = `perspective(1000px) rotateX(${-percentY}deg) rotateY(${percentX}deg) scale(1.03)`

    // Add a dynamic shadow
    element.style.boxShadow = `
      ${percentX * -0.5}px ${percentY * -0.5}px 30px rgba(0, 0, 0, 0.4),
      0 0 30px rgba(59, 130, 246, 0.3)
    `

    // Add a dynamic highlight effect
    const glowX = (x / rect.width) * 100
    const glowY = (y / rect.height) * 100
    element.style.background = `
      linear-gradient(135deg, 
        rgba(30, 41, 59, 0.95), 
        rgba(30, 58, 138, 0.9)), 
      radial-gradient(
        circle at ${glowX}% ${glowY}%, 
        rgba(59, 130, 246, 0.3) 0%, 
        transparent 50%
      )
    `
  })

  // Reset transform on mouse leave
  element.addEventListener("mouseleave", () => {
    element.style.transform = ""
    element.style.boxShadow = ""
    element.style.background = "linear-gradient(135deg, var(--card-bg-color), rgba(30, 58, 138, 0.9))"
  })
}

// Create endpoint cards with animation
function createEndpointCards(endpointsToShow = endpoints) {
  const endpointList = document.getElementById("endpointList")
  endpointList.innerHTML = ""

  endpointsToShow.forEach((endpoint, index) => {
    const card = document.createElement("div")
    card.className = "endpoint-card"
    card.style.animationDelay = `${index * 0.05}s`
    card.innerHTML = `
      <h3>${endpoint.name}</h3>
      <p>${endpoint.description}</p>
      <p><strong>Method:</strong> <span class="method-tag">${endpoint.method}</span></p>
      <p><strong>Parameters:</strong> ${endpoint.params.length ? endpoint.params.map((param) => `<span class="param-tag">${param}</span>`).join(" ") : "None"}</p>
      <div class="endpoint-buttons">
        <button class="copy-url" data-path="${endpoint.path}">
          <span>Copy URL</span>
          <span class="button-glow"></span>
        </button>
        <button class="test-endpoint" data-path="${endpoint.path}">
          <span>Test Endpoint</span>
          <span class="button-glow"></span>
        </button>
      </div>
    `
    endpointList.appendChild(card)

    // Add 3D tilt effect to each card
    addTiltEffect(card)
  })

  // Add click event listeners to Copy URL buttons
  document.querySelectorAll(".copy-url").forEach((button) => {
    button.addEventListener("click", (e) => {
      const path = e.target.closest(".copy-url").getAttribute("data-path")
      const url = `${window.location.origin}${path}`
      navigator.clipboard.writeText(url).then(() => {
        showNotification("URL copied to clipboard!")
      })
    })
  })

  // Add click event listeners to Test Endpoint buttons
  document.querySelectorAll(".test-endpoint").forEach((button) => {
    button.addEventListener("click", (e) => {
      const path = e.target.closest(".test-endpoint").getAttribute("data-path")
      const url = `${window.location.origin}${path}`
      window.open(url, "_blank")
    })
  })
}

// Format URL
function formatUrl(path) {
  return `${window.location.origin}${path}`
}

// Fetch request count
async function fetchRequestCount() {
  try {
    const response = await fetch(`${window.location.origin}/api/requests`)
    const data = await response.json()
    if (data.success) {
      const countElement = document.getElementById("requestCount")
      countElement.textContent = data.request_count.toLocaleString()
    } else {
      document.getElementById("requestCount").textContent = "Error fetching count"
    }
  } catch (error) {
    console.error("Error fetching request count:", error)
    document.getElementById("requestCount").textContent = "Error"
  }
}

// Setup menu toggle
function setupMenuToggle() {
  const menuToggle = document.getElementById("menuToggle")
  const sideMenu = document.querySelector(".side-menu")

  menuToggle.addEventListener("click", () => {
    sideMenu.classList.toggle("open")

    // Add animation to menu toggle
    if (sideMenu.classList.contains("open")) {
      menuToggle.style.transform = "scale(1.1) rotate(90deg)"
    } else {
      menuToggle.style.transform = "scale(1) rotate(0deg)"
    }
  })

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!sideMenu.contains(e.target) && e.target !== menuToggle) {
      sideMenu.classList.remove("open")
      menuToggle.style.transform = "scale(1) rotate(0deg)"
    }
  })
}

// Create particles with enhanced visuals
function createParticles() {
  const container = document.querySelector(".background-image")
  const particleCount = 50

  // Create different types of particles
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div")
    particle.className = "particle"

    // Randomize particle properties
    const size = Math.random() * 15 + 3
    const colors = ["rgba(59, 130, 246, 0.3)", "rgba(37, 99, 235, 0.3)", "rgba(96, 165, 250, 0.3)"]
    const color = colors[Math.floor(Math.random() * colors.length)]

    // Style the particle
    particle.style.position = "absolute"
    particle.style.width = `${size}px`
    particle.style.height = particle.style.width
    particle.style.backgroundColor = color
    particle.style.borderRadius = "50%"
    particle.style.top = `${Math.random() * 100}%`
    particle.style.left = `${Math.random() * 100}%`

    // Add different animation durations and delays
    const duration = Math.random() * 20 + 10
    const delay = Math.random() * 10
    particle.style.animation = `float ${duration}s infinite ease-in-out`
    particle.style.animationDelay = `${delay}s`
    particle.style.opacity = `${Math.random() * 0.5 + 0.1}`

    container.appendChild(particle)
  }

  // Add floating light streaks
  for (let i = 0; i < 15; i++) {
    const streak = document.createElement("div")
    streak.className = "particle streak"

    const width = Math.random() * 150 + 50
    const height = Math.random() * 2 + 1
    const rotation = Math.random() * 360

    streak.style.width = `${width}px`
    streak.style.height = `${height}px`
    streak.style.backgroundColor = "rgba(59, 130, 246, 0.2)"
    streak.style.transform = `rotate(${rotation}deg)`
    streak.style.top = `${Math.random() * 100}%`
    streak.style.left = `${Math.random() * 100}%`
    streak.style.animation = `float ${Math.random() * 30 + 20}s infinite ease-in-out`
    streak.style.animationDelay = `${Math.random() * 10}s`

    container.appendChild(streak)
  }
}

// Animate hero text
function animateHeroText() {
  const heroText = document.querySelector(".hero p.para")
  if (heroText) {
    const text = heroText.textContent
    heroText.textContent = ""
    heroText.style.borderRight = "3px solid var(--gold-color)"

    let i = 0
    const typeWriter = () => {
      if (i < text.length) {
        heroText.textContent += text.charAt(i)
        i++
        setTimeout(typeWriter, 100)
      } else {
        // Remove the cursor when done typing
        setTimeout(() => {
          heroText.style.borderRight = "none"
        }, 1000)
      }
    }

    typeWriter()
  }
}

// Show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = "notification"
  notification.textContent = message

  // Add to DOM
  document.body.appendChild(notification)

  // Trigger animation
  setTimeout(() => {
    notification.style.opacity = "1"
    notification.style.transform = "translateY(0)"
  }, 10)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0"
    notification.style.transform = "translateY(20px)"

    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Create scroll indicator
function createScrollIndicator() {
  const indicator = document.createElement("div")
  indicator.className = "scroll-indicator"
  document.body.appendChild(indicator)

  window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const scrolled = (scrollTop / scrollHeight) * 100
    indicator.style.width = scrolled + "%"
  })
}

// Add search functionality
function setupSearch() {
  const searchInput = document.getElementById("searchInput")
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase()

      if (searchTerm.length > 0) {
        const filteredEndpoints = endpoints.filter(
          (endpoint) =>
            endpoint.name.toLowerCase().includes(searchTerm) ||
            endpoint.description.toLowerCase().includes(searchTerm) ||
            endpoint.category.toLowerCase().includes(searchTerm),
        )
        createEndpointCards(filteredEndpoints)
      } else {
        createEndpointCards(endpoints)
      }
    })
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  createCategoryList()
  setupMenuToggle()
  createEndpointCards()
  fetchRequestCount()
  createParticles()
  animateHeroText()
  createScrollIndicator()
  setupSearch()

  // Update request count every 30 seconds
  setInterval(fetchRequestCount, 30000)

  // Highlight the first category (All) by default
  const firstCategory = document.querySelector("#categoryList a")
  if (firstCategory) {
    highlightActiveCategory(firstCategory)
  }
})

