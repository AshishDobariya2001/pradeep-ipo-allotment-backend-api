# Use a smaller Node.js image as base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Install necessary dependencies for Chromium
RUN apk update && apk add --no-cache \
    chromium \
    nss \
    harfbuzz \
    freetype \
    ttf-freefont \
    fontconfig

COPY . .
# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Set Puppeteer to use the installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Start the application
CMD ["npm", "run", "start:prod"]
