# Paymaster Management App

## Introduction

The Paymaster Policy Manager is a management tool for creating, editing, and monitoring Paymaster
policies. It’s designed for ecosystem and dApp managers who need fine-grained control over gas
sponsorship rules and visibility into how those policies are being used.

## 🏗️ Project Structure

This is a **monorepo** built with **Turborepo** and **pnpm** workspaces for efficient task
orchestration and caching:

```
Paymaster-Management-App-frontend/
├── apps/
│   ├── frontend/           # React + Vite application
│   └── backend/            # NestJS REST API
├── packages/               # Shared packages and configurations
│   ├── prisma/             # Database schema and client
│   ├── eslint-config/      # Shared ESLint configuration
│   ├── typescript-config/  # Shared TypeScript configuration
│   └── jest-config/        # Shared Jest configuration
├── docker compose.yml      # Docker services configuration
├── turbo.json              # Turborepo configuration
├── pnpm-workspace.yaml     # pnpm workspace configuration
└── package.json            # Root package.json with scripts
```

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
   cd Paymaster-Management-App-frontend
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

6. **Start development servers:**

   ```bash
   pnpm start:dev
   ```

> **⚠️ Important:** Always run `pnpm` commands from the **root directory**
> (`Paymaster-Management-App-frontend/`). The monorepo structure handles all workspaces
> automatically - never run `pnpm install` inside individual `apps/` folders.

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

### Code Quality

This repository uses **Prettier** for code formatting and **ESLint** for TypeScript linting:

- **Prettier** formats all supported file types (TypeScript, JavaScript, JSON, YAML, Markdown)
- **ESLint** lints TypeScript code and applies Prettier formatting rules
- Commands **exit with error codes** when issues are detected, making them CI/CD friendly

Both tools are configured to work together seamlessly across the entire monorepo.

### IDE Integration

The Prettier and ESLint setup is designed to work well with modern IDEs. It's recommended to enable
IDE integration to get instant feedback while writing code and have files formatted automatically on
save. This provides immediate visual feedback and ensures code quality before committing.

## 🔧 Development Workflow

### Building the Code

To build the code, execute `pnpm build`. All packages are built and results are cached by Turborepo.
As a result, subsequent executions will use cached results until the package code changes, making
builds significantly faster.

**Important:** Changes to shared packages (in `packages/`) require rebuilding before restarting
services, as applications import these packages and need the latest compiled versions.

### Starting Services

All services can be started simultaneously with `pnpm start:dev`. This command launches both
frontend and backend in development mode with hot reloading. Services automatically restart when
their own code changes, but changes to shared packages require a manual rebuild and restart:

```bash
pnpm build        # Rebuild shared packages if needed
pnpm start:dev    # Restart all services
```

### Testing the Code

To execute tests, run `pnpm test`. All test results are cached by Turborepo, so subsequent runs only
execute tests for changed packages. Tests include code coverage analysis and must maintain the
required coverage level to pass.

### Working with the database

This repository contains integration with PostgreSQL using Prisma ORM for type-safe database access.
The database schema is managed through migrations - scripts that define incremental changes to keep
your database structure synchronized with the application code.

#### Applying migrations

Every time the repository code is checked out or pulled from the remote, and it contains changes to
the database schema, these changes need to be applied to your local database instance. When there
are new migration files, apply them to your local database:

```bash
pnpm prisma:migrate:deploy
```

If `migrate:deploy` fails it typically means:

- Your local database and remote changes are out-of-sync
- Migration files are corrupted or applied in wrong order
- You need to reset your database (see below)

#### Populating the database with sample data

After applying migrations to a fresh database, you can populate it with sample data:

```bash
pnpm prisma:seed
```

#### Resetting the database

Often, when working locally and, for instance, switching branches with unfinished implementations, a
local database is out-of-sync with migration in a way that forces it to be recreated. It can be done
in two ways:

- Executing `pnpm prisma:migrate:reset`
- Removing the database container and its volumes and recreating them if the above does not work

The reset command automatically repopulates with sample data. To reset without seeding:

```bash
pnpm prisma:migrate:reset -- --skip-seed
```

#### Extending the schema

Database schema and model provided by the Prisma ORM are defined in the
`packages/prisma/prisma/schema.prisma` file. The
[Prisma schema reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
is a helpful resource for understanding the syntax and available options.

#### Generating and updating Prisma client code

Prisma generates type-safe client code based on your schema definition. The client needs to be
regenerated after checking out or updating code, and each time the schema changes. To manually
generate the client, execute `pnpm prisma:generate`. However, this happens automatically when
running `pnpm build` or `pnpm start:dev`

#### Creating migrations

Every change made to schema.prisma requires to be reflected in a new migration created. New
migrations are created with the `pnpm prisma:migrate:dev` command, which will prompt you to provide
a descriptive migration name. It also applies new migration to the database instance.

#### Merging migrations

It is considered good practice to minimize the number of migrations. When working on your feature
branch, you should consolidate all migrations added by your branch into a single migration.
Additionally, the new migration needs to be applied on top of all existing migrations from the base
branch. To merge or recreate migrations:

- Remove the migration files you want to consolidate
- Reset your database
- Create and commit a new consolidated migration

#### Browsing the database

Prisma provides a convenient way to browse and manipulate database data through Prisma Studio. To
start it, execute `pnpm prisma:studio` and it will open a user interface in your default browser.
Additionally, the local database instance is accessible at `127.0.0.1:5432` when started with
Docker, so you can also connect with your favorite database tool.

#### Database setup for local development

Start only the database service with Docker Compose and run the application locally:

```bash
# Start only the database
docker compose up -d backend-db

# Start development servers locally
pnpm start:dev
```

## 🐳 Docker Development

### Development with Docker Compose

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

## 🐛 Troubleshooting

**Clear all caches and reinstall:**

```bash
pnpm clean:all
pnpm install
```

**Reset Docker environment:**

```bash
docker compose down -v
docker compose up --build
```

## 📚 Additional Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [NestJS Documentation](https://nestjs.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)

## Milestones

Welcome to the 1st milestone of the Patterns Paymaster Management App!

We have implemented SIWE authentication so you'll need a supported wallet to login :) Please note
that this is just a frontend preview so the application is not functional. All data is mocked up and
most buttons will not work as they require fully operational backend.

<img width="800" alt="image" src="https://github.com/user-attachments/assets/2d03a651-0ee3-4c55-aaa7-35241591e52e" />

After clicking on "New policy", you'll be able to access the creation of a new policy:

<img width="800" alt="image" src="https://github.com/user-attachments/assets/1c50a89b-d96a-47de-ba29-4c504bfbbb81" />
