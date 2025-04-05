# Build stage
FROM node:18-alpine AS builder
 
# Install dependencies for node-gyp and canvas
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo \
    cairo-dev \
    pango \
    pango-dev \
    jpeg \
    jpeg-dev \
    giflib \
    giflib-dev \
    librsvg \
    librsvg-dev \
    bash
 
# Set working directory
WORKDIR /app
 
# Copy package.json and package-lock.json first to leverage caching
COPY package*.json ./
 
# Install dependencies in production mode
RUN npm ci --only=production
 
# Copy the rest of the application
COPY . .
 
# Build the React app
RUN npm run build
 
# Production stage with Nginx
FROM nginx:alpine
 
# Copy built files from the previous stage
COPY --from=builder /app/build /usr/share/nginx/html
 
# Expose port 80
EXPOSE 80
 
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]