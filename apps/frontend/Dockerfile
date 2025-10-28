# Base stage with common dependencies
FROM node:22-alpine@sha256:d2166de198f26e17e5a442f537754dd616ab069c47cc57b889310a717e0abbf9 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache libc6-compat && \
    corepack enable && \
    pnpm install turbo --global

# Builder stage - prune the monorepo
FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune --scope=frontend --docker

# Installer stage - install dependencies and build
FROM base AS installer
WORKDIR /app

# Accept build arguments for environment configuration
ARG MODE=production
ARG NODE_ENV=production

# Copy pruned dependency files
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/out/full/.npmrc ./.npmrc

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy pruned source files and build config
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Set environment variables
ENV NODE_ENV=${NODE_ENV}
ENV VITE_MODE=${MODE}
ENV DOCKER=1

# Build constants package first (without --mode flag)
RUN turbo run build --filter=@repo/constants

# Build frontend with --mode flag using pnpm directly
RUN pnpm --filter=frontend build -- --mode ${MODE}

# Production stage
FROM nginx:1.29.1-alpine@sha256:42a516af16b852e33b7682d5ef8acbd5d13fe08fecadc7ed98605ba5e3b26ab8 AS runner

# Copy built app to nginx
COPY --from=installer /app/apps/frontend/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY --from=installer /app/apps/frontend/nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]