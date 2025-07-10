📄 Application Documentation
This project consists of two main parts:

Frontend – built with React.js using the Vite build engine
Backend – built with Node.js and Express.js

🔐 Functionality
User authentication via Sign-In with Ethereum (SIWE)

Session management on the backend to maintain user login state

📁 Project Structure

/project-root
│
├── frontend/       # React + Vite application
├── backend/        # Express.js server
├── docker-compose.yml
└── README.md       # Documentation
🚀 Running the Application
1. Clone the Repository

git clone <repo-url>
cd <repo-folder>
2. Prepare Environment Variables
In the backend directory, copy the example environment file:

Set variables in .env as in example.env

3. Build the Application

docker compose build

4. Start the Application

docker compose up
🌐 Access
After starting, the frontend is available at:

http://localhost:5173

🛠 Technologies Used
Frontend:
React.js
Vite
ethers.js or web3.js – for wallet interaction
SIWE – Ethereum-based login

Backend:
Node.js
Express.js
express-session

📝 Notes
The app uses Ethereum wallets – you can test it using MetaMask.

The backend must handle CORS to allow requests from the frontend (http://localhost:5173).

Make sure your system clock is synchronized – SIWE relies on accurate timestamps.

