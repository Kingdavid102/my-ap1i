FROM node:20-bullseye

# Install system dependencies for Playwright
RUN apt-get update && apt-get install -y \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm-dev \
    libglib2.0-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libx11-6 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libxshmfence1 \
    xvfb \
    --no-install-recommends

WORKDIR /app

# First copy only package files for better caching
COPY package*.json ./

RUN npm install

# Copy the rest of the files
COPY . .

# Install Playwright browsers
ENV PLAYWRIGHT_BROWSERS_PATH=/app/.cache/ms-playwright
RUN npx playwright install chromium
RUN npx playwright install-deps

EXPOSE 10000

CMD ["node", "server.js"]
