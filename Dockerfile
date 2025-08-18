FROM node:20-bullseye

# Install system dependencies for Playwright
RUN apt-get update && apt-get install -y \
    git \
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
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install node dependencies
RUN npm install

# Set environment variables for Playwright
ENV PLAYWRIGHT_BROWSERS_PATH=/app/.cache/ms-playwright

# Create cache directory
RUN mkdir -p /app/.cache/ms-playwright && \
    chown -R node:node /app/.cache

# Install Playwright with chromium
RUN npx playwright install chromium && \
    npx playwright install-deps

# Copy the rest of the application
COPY . .

# Run as non-root user
USER node

EXPOSE $PORT

CMD ["node", "server.js"]
