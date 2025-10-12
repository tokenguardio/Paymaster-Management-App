# Paymaster Management App

## Introduction

The Paymaster Policy Manager is a management tool for creating, editing, and monitoring Paymaster
policies. It’s designed for ecosystem and dApp managers who need fine-grained control over gas
sponsorship rules and visibility into how those policies are being used.

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
