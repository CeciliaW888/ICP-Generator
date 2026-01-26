# Build Stage
FROM node:20-alpine

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./
COPY server/package.json ./server/

# Install dependencies
RUN npm install
RUN cd server && npm install

# Copy source code
COPY . .

# Build the frontend
# Note: VITE_API_KEY is no longer needed at build time!
RUN npm run build

# Expose port (Cloud Run defaults to 8080)
EXPOSE 8080
ENV PORT=8080
# GOOGLE_API_KEY will be injected by Cloud Run environment variables

# Start the server
CMD ["node", "server/index.js"]
