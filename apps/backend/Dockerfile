# Use the official Node.js image
FROM node:22-alpine AS base

# Enable corepack for package manager management
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy root package files and workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc ./
COPY turbo.json ./

# Copy workspace packages (shared configs, etc.)
COPY packages/ ./packages/

# Copy only backend app (not other apps)
COPY apps/backend/ ./apps/backend/

# Install dependencies for entire monorepo
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder

# Build the Prisma package first and backend
RUN pnpm build --filter=@repo/prisma && \
    pnpm build --filter=backend

# Production stage
FROM node:22-alpine AS production

# Enable corepack
RUN corepack enable
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc ./

# Copy workspace packages source
COPY packages/ ./packages/

# Copy backend source
COPY apps/backend/package.json ./apps/backend/

# Copy built Prisma package from builder stage
COPY --from=builder /app/packages/prisma/dist ./packages/prisma/dist
COPY --from=builder /app/packages/prisma/generated ./packages/prisma/generated

# Copy built backend from builder stage
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Expose port
EXPOSE 3000

# Set the working directory to backend
WORKDIR /app/apps/backend

# Start the application
CMD ["node", "dist/main.js"]
