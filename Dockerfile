# Use official Playwright base image (comes with Chromium, Firefox, WebKit + deps)
FROM mcr.microsoft.com/playwright:v1.46.1-jammy

# Set working directory
WORKDIR /app

# Copy only package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your code
COPY . .

# Make sure screenshots dir exists
RUN mkdir -p /app/screenshots && chown -R pwuser:pwuser /app

# Run as non-root user (Playwright image uses pwuser)
USER pwuser

# Expose Heroku port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
