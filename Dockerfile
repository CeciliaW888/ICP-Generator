# Build Stage
FROM node:23-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build args for Environment Variables
# Note: In a real CI/CD, you might inject this differently, 
# but for a static build, it must be present at build time.
ARG VITE_API_KEY
ENV VITE_API_KEY=$VITE_API_KEY

# Build the application
RUN npm run build

# Production Stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
