FROM node:21-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache curl dumb-init

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy all source files
COPY . .

# Build TypeScript
RUN npm run build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeapp -u 1001 -G nodejs

# Change ownership of the app directory
RUN chown -R nodeapp:nodejs /app

USER nodeapp

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Start the server
CMD ["dumb-init", "npm", "start"]