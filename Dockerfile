# Multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app

# Install git (required by VitePress for file metadata)
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Initialize git repo (required by VitePress)
RUN if [ ! -d ".git" ]; then git init; fi && \
    git config user.email "build@choreoatlas.io" && \
    git config user.name "Docker Build" && \
    (git add . && git diff --cached --quiet || git commit -m "Docker build")

# Build the site
RUN npm run docs:build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html

# Copy nginx configuration files
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]