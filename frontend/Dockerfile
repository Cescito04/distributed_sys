# Use Node.js 18 Alpine as base image for smaller size
FROM node:18-alpine AS base

# Dependencies stage - install only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on preferred package manager
COPY package.json package-lock.json* ./
RUN npm install

# Builder stage - rebuild source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables for build process
ENV NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Build Next.js application for production
RUN npm run build

# Production image - copy all files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Create system user and group for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Set correct permissions for cache directory
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically copy output files to optimize copying
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user for security
USER nextjs

# Expose port 3000
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the Next.js server
CMD ["node", "server.js"]
