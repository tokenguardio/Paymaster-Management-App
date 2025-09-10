# Build stage
FROM node:22-alpine@sha256:d2166de198f26e17e5a442f537754dd616ab069c47cc57b889310a717e0abbf9 AS build

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

# Copy only frontend app (not other apps)
COPY apps/frontend/ ./apps/frontend/

# Set Docker env to skip husky
ENV DOCKER=1

# Install dependencies for entire monorepo
RUN pnpm install --frozen-lockfile

# Accept build arguments for environment configuration
ARG MODE=production
ARG NODE_ENV=production

# Set environment variables
ENV NODE_ENV=${NODE_ENV}
ENV VITE_MODE=${MODE}

# Build the frontend app using turbo with specified mode
RUN pnpm build --filter=frontend -- --mode ${MODE}

# Production stage
FROM nginx:1.29.1-alpine@sha256:42a516af16b852e33b7682d5ef8acbd5d13fe08fecadc7ed98605ba5e3b26ab8

# Copy built app to nginx
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY apps/frontend/nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
