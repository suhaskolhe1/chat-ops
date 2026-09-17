# Chat Ops 🚀

[![CI/CD Pipeline](https://github.com/suhaskolhe1/chat-ops/actions/workflows/ci.yml/badge.svg)](https://github.com/suhaskolhe1/chat-ops/actions/workflows/ci.yml)

**Chat Ops** is a modern, real-time workspace communication platform. Built with a stark, brutalist design philosophy, it strips away visual clutter to provide a lightning-fast, highly focused environment for engineering teams.

## 🌟 Overview for Recruiters & Hiring Managers

If you are reviewing this project, here is a quick summary of the technical achievements demonstrated in this repository:

- **Full-Stack JavaScript:** Built using modern ES Modules across both the frontend and backend (Node.js).
- **Real-Time Communication:** Leverages **Socket.io (WebSockets)** to ensure messages are delivered instantly without page refreshes.
- **Enterprise-Grade Infrastructure:** Utilizes **PostgreSQL** for persistent message storage and **Redis** for managing real-time user presence (online/typing status).
- **Containerization:** Fully dockerized utilizing multi-stage builds. A custom `docker-compose.yml` orchestrates the Node application, Postgres database, and Redis cache, ensuring identical behavior across local and production environments.
- **CI/CD Automation:** Integrates **GitHub Actions** to automatically spin up service containers, run unit tests via **Jest**, and trigger zero-downtime deployments to **Render** via webhooks upon successful builds.
- **UI/UX:** Features a bespoke, zero-dependency "Brutalist" frontend. No bloated CSS frameworks—just pure, high-contrast, minimalist design optimized for developer workflows.

---

## 🛠️ Technical Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Cache / PubSub:** Redis
- **WebSockets:** Socket.io
- **Frontend:** Vanilla HTML/CSS/JS (Brutalist UI)
- **Testing:** Jest, Supertest
- **DevOps:** Docker, Docker Compose, GitHub Actions, Render

## 🚀 Running Locally

You can spin up the entire application stack locally using Docker.

1. **Clone the repository**
   ```bash
   git clone https://github.com/suhaskolhe1/chat-ops.git
   cd chat-ops
   ```

2. **Start the environment**
   ```bash
   docker compose up --build
   ```

3. **Open the app**
   Navigate to `http://localhost:3000` in your web browser. Open a second tab to test the real-time WebSocket messaging!

## 🧪 Running Tests

The test suite runs automatically on every push via GitHub Actions, but you can run it locally:

```bash
npm install
npm test
```
