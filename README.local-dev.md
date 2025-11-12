# Local Development Setup

This guide is for contributors and maintainers who want to run the Paymaster Management App locally.

## Prerequisites

- **Git**
- **Node.js 22** - Using [NVM](https://github.com/nvm-sh/nvm) is recommended for Node.js version
  management
- **corepack** - Bundled with Node.js; enable it by running `corepack enable`
- **Docker** and **Docker Compose** - Required for containerized development

## Local Development Setup

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

   **Required Configuration:**

   Edit `apps/backend/.env` and configure the following variables:
   - **Server Configuration:**
     - `PORT` - Server port (default: 3000)
     - `BIND_ADDRESS` - Server bind address (default: 127.0.0.1)
     - `NODE_ENV` - Environment mode (development/production/test)

   - **Blockchain Configuration:**
     - `ETHEREUM_RPC_URL` - Ethereum Mainnet RPC endpoint URL
     - `SEPOLIA_RPC_URL` - Ethereum Sepolia testnet RPC endpoint URL

   - **Paymaster Signer Configuration:**
     - `PAYMASTER_SIGNER_PRIVATE_KEY` - Private key for signing paymaster operations (with 0x
       prefix)
     - `PAYMASTER_SIGNER_ADDRESS` - Address derived from the signer private key
     - `PAYMASTER_ADDRESS` - Deployed paymaster contract address

   - **EIP-712 Domain Configuration:**
     - `PAYMASTER_EIP712_DOMAIN_NAME` - Domain name for EIP-712 signing (e.g.,
       "MyPaymasterECDSASigner")
     - `PAYMASTER_EIP712_DOMAIN_VERSION` - Domain version for EIP-712 signing (e.g., 1)
     - `PAYMASTER_EIP712_DOMAIN_SIGNATURE_TTL_SECONDS` - Signature validity duration in seconds
       (e.g., 600)

   > **Note:** All paymaster-related variables are validated on startup. The application will fail
   > to start if any required configuration is missing or invalid.

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

## Available Scripts

### Development

- `pnpm start:dev` - Start all development servers (frontend + backend) with TUI dashboard
- `pnpm build` - Build all packages and applications
- `pnpm test` - Run all tests across the monorepo

### Code Quality

- `pnpm lint` - Lint all TypeScript code (exits with error if issues found)
- `pnpm lint:fix` - Lint and auto-fix issues where possible
- `pnpm format:check` - Check code formatting (exits with error if not formatted)
- `pnpm format:fix` - Format all code using Prettier

### Cleanup

- `pnpm clean:all` - Clean all build artifacts, dependencies, and caches
- `pnpm clean:dist` - Remove build output directories
- `pnpm clean:coverage` - Remove test coverage reports
- `pnpm clean:turbo` - Clear Turborepo cache
- `pnpm clean:node-modules` - Remove all node_modules directories

### Working with Specific Apps

Use the `--filter` flag to run commands on specific applications:

```bash
pnpm build --filter=backend    # Example: build only backend
```
