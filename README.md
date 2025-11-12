# Paymaster Management App

## Introduction

The Paymaster Policy Manager is a management tool for creating, editing, and monitoring Paymaster
policies. It’s designed for ecosystem and dApp managers who need fine-grained control over gas
sponsorship rules and visibility into how those policies are being used.

## Start the App with Docker

To run the Paymaster Management App using Docker Compose, follow the instructions below.

**Prerequisites:**

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) must be
  installed on your system.

### 1. Set up environment variables

Before running the app, make sure to create and configure the required `.env` files:

- Copy example files:
  ```bash
  cp apps/backend/.env.example apps/backend/.env
  cp packages/prisma/.env.example packages/prisma/.env
  ```
- Edit `apps/backend/.env` to provide the necessary values. Required configuration for
  `apps/backend/.env` includes:
  - **Blockchain Configuration:**
    - `ETHEREUM_RPC_URL` - Ethereum Mainnet RPC endpoint URL
    - `SEPOLIA_RPC_URL` - Ethereum Sepolia testnet RPC endpoint URL

  - **Paymaster Signer Configuration:**
    - `PAYMASTER_SIGNER_PRIVATE_KEY` - Private key for signing paymaster operations (with 0x prefix)
    - `PAYMASTER_SIGNER_ADDRESS` - Address derived from the signer private key
    - `PAYMASTER_ADDRESS` - Deployed paymaster contract address

  - **EIP-712 Domain Configuration:**
    - `PAYMASTER_EIP712_DOMAIN_NAME` - Domain name for EIP-712 signing (e.g.,
      "MyPaymasterECDSASigner")
    - `PAYMASTER_EIP712_DOMAIN_VERSION` - Domain version for EIP-712 signing (e.g., 1)
    - `PAYMASTER_EIP712_DOMAIN_SIGNATURE_TTL_SECONDS` - Signature validity duration in seconds
      (e.g., 600)

### 2. Build and run all services

```bash
docker compose up --build
```

### 3. Access the applications

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000
- **API Documentation:** http://localhost:3000/docs

### 4. Run in detached mode

```bash
docker compose up -d --build
```

### 5. Stop services

```bash
docker compose down
```
