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

# First copy only package.json
COPY package.json .

# Generate package-lock.json if missing (with clean install)
RUN if [ ! -f package-lock.json ]; then \
      npm install --package-lock-only && \
      npm ci; \
    fi

# Now copy all remaining files (excluding node_modules)
COPY . .

# Install Playwright with Chromium
ENV PLAYWRIGHT_BROWSERS_PATH=/app/.cache/ms-playwright
RUN mkdir -p /app/.cache/ms-playwright && \
    npx playwright install chromium && \
    npx playwright install-deps

EXPOSE 10000

CMD ["node", "server.js"]
