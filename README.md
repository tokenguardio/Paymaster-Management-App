# Paymaster Management App

## Introduction

The Paymaster Policy Manager is a management tool for creating, editing, and monitoring Paymaster
policies. It’s designed for ecosystem and dApp managers who need fine-grained control over gas
sponsorship rules and visibility into how those policies are being used.

## 🚀 Getting Started

### Prerequisites

- **Git**
- **Node.js 22** - Using [NVM](https://github.com/nvm-sh/nvm) is recommended for Node.js version
  management
- **corepack** - Bundled with Node.js; enable it by running `corepack enable`
- **Docker** and **Docker Compose** - Required for containerized development

### Local Development Setup

1. **Clone the repository and navigate to the project:**

   ```bash
   git clone <repository-url>
   cd Paymaster-Management-App
   ```

2. **Set up Node.js version:**

   ```bash
   nvm install && nvm use
   ```

3. **Enable corepack (if a new Node.js version was installed):**

   ```bash
   corepack enable
   ```

4. **Install dependencies:**

   ```bash
   pnpm install
   ```

5. **Configure environment variables:**

   ```bash
   cp apps/backend/.env.example apps/backend/.env
   cp packages/prisma/.env.example packages/prisma/.env
   ```

6. Start the database

   ```bash
   docker compose up -d backend-db
   ```

7. Apply migrations and seed the database

   ```bash
   # Apply migrations
   pnpm prisma:migrate:deploy

   # Seed the database
   pnpm prisma:seed
   ```

8. **Start development servers:**

   ```bash
   pnpm start:dev
   ```

### Available Scripts

#### Development

- `pnpm start:dev` - Start all development servers (frontend + backend) with TUI dashboard
- `pnpm build` - Build all packages and applications
- `pnpm test` - Run all tests across the monorepo

#### Code Quality

- `pnpm lint` - Lint all TypeScript code (exits with error if issues found)
- `pnpm lint:fix` - Lint and auto-fix issues where possible
- `pnpm format:check` - Check code formatting (exits with error if not formatted)
- `pnpm format:fix` - Format all code using Prettier

#### Cleanup

- `pnpm clean:all` - Clean all build artifacts, dependencies, and caches
- `pnpm clean:dist` - Remove build output directories
- `pnpm clean:coverage` - Remove test coverage reports
- `pnpm clean:turbo` - Clear Turborepo cache
- `pnpm clean:node-modules` - Remove all node_modules directories

#### Working with Specific Apps

Use the `--filter` flag to run commands on specific applications:

```bash
pnpm build --filter=backend    # Example: build only backend
```

## 🐳 Docker

### Run application with Docker Compose

1. **Build and run all services:**

   ```bash
   docker compose up --build
   ```

2. **Access the applications:**
   - **Frontend:** http://localhost:8080
   - **Backend API:** http://localhost:3000
   - **API Documentation:** http://localhost:3000/docs

3. **Run in detached mode:**

   ```bash
   docker compose up -d --build
   ```

4. **Stop services:**
   ```bash
   docker compose down
   ```

## Milestones

Welcome to the 1st milestone of the Patterns Paymaster Management App!

We have implemented SIWE authentication so you'll need a supported wallet to login :) Please note
that this is just a frontend preview so the application is not functional. All data is mocked up and
most buttons will not work as they require fully operational backend.

<img width="800" alt="image" src="https://github.com/user-attachments/assets/2d03a651-0ee3-4c55-aaa7-35241591e52e" />

After clicking on "New policy", you'll be able to access the creation of a new policy:

<img width="800" alt="image" src="https://github.com/user-attachments/assets/1c50a89b-d96a-47de-ba29-4c504bfbbb81" />
