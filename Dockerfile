# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/package*.json ./
RUN npm install --production
COPY --from=build /app/dist ./dist
COPY --from=build /app/.env ./
# Install necessary dependencies for Chromium
RUN apk update && apk add --no-cache \
    chromium \
    nss \
    harfbuzz \
    freetype \
    ttf-freefont \
    fontconfig
# Set Puppeteer to use the installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
