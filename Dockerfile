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

# Create app directory structure with proper permissions
RUN mkdir -p /app/screenshots && \
    chown -R node:node /app

WORKDIR /app

# Clone repository (with proper cleanup)
RUN git clone https://github.com/Kingdavid102/my-api.git /app-temp && \
    mv /app-temp/* /app/ && \
    mv /app-temp/.git* /app/ && \
    rm -rf /app-temp && \
    chown -R node:node /app

# Install dependencies
RUN npm install

# Set Playwright cache path
ENV PLAYWRIGHT_BROWSERS_PATH=/home/node/.cache/ms-playwright

# Install Playwright with all dependencies
RUN npx playwright install --with-deps chromium && \
    npx playwright install-deps

# Ensure proper permissions for Playwright and screenshots
RUN chown -R node:node /home/node/.cache && \
    chown -R node:node /app/screenshots

# Run as non-root user
USER node

EXPOSE 3000

CMD ["node", "server.js"]