FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /app/build build/
COPY --from=builder /app/static static/
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/src/lib/db ./src/lib/db

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 sveltekit

USER sveltekit

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "build"]