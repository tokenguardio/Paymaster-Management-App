FROM node:22-alpine@sha256:bd26af08779f746650d95a2e4d653b0fd3c8030c44284b6b98d701c9b5eb66b9 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache libc6-compat && \
    corepack enable && \
    pnpm install turbo --global

FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune --scope=backend --docker

FROM base AS installer
WORKDIR /app
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
ENV DOCKER=1

# Build the project (Prisma first, then backend)
RUN turbo run build --filter=@repo/prisma && \
    turbo run build --filter=backend

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy package files for production install
COPY --from=installer /app/package.json ./
COPY --from=installer /app/pnpm-lock.yaml ./
COPY --from=installer /app/pnpm-workspace.yaml ./
COPY --from=installer /app/.npmrc ./

# Copy built packages
COPY --from=installer --chown=nestjs:nodejs /app/packages/ ./packages/
COPY --from=installer --chown=nestjs:nodejs /app/apps/backend/package.json ./apps/backend/
COPY --from=installer --chown=nestjs:nodejs /app/apps/backend/dist ./apps/backend/dist

# Set environment variables
ENV DOCKER=1
ENV NODE_ENV=production

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy entrypoint script from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Change ownership and switch to non-root user
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3000

# Set working directory to backend
WORKDIR /app/apps/backend

# Start the application
ENTRYPOINT ["/app/docker-entrypoint.sh"]