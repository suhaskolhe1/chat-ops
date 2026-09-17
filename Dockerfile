# Stage 1: Build dependencies
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
COPY public ./public

# Stage 2: Final minimal image
FROM node:20-alpine
# Create a non-root user (node user is provided by the alpine node image)
USER node
WORKDIR /app

# Copy built files and dependencies with proper ownership
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./
COPY --from=builder --chown=node:node /app/src ./src
COPY --from=builder --chown=node:node /app/public ./public

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "src/server.js"]
