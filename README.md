# Chat Ops

[![CI/CD Pipeline](https://github.com/suhaskolhe1/chat-ops/actions/workflows/ci.yml/badge.svg)](https://github.com/suhaskolhe1/chat-ops/actions/workflows/ci.yml)

Chat Ops is a real-time messaging application built for technical teams. It provides a minimal, distraction-free environment for communication across isolated workspaces.

## Architecture

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (persistent storage)
- **Real-time Engine:** Socket.io (WebSockets)
- **Cache/State:** Redis (user presence tracking)
- **Frontend:** Vanilla HTML/CSS/JS with a brutalist design system
- **Infrastructure:** Docker, Render, GitHub Actions

## Features

- Real-time bidirectional messaging via WebSockets.
- Isolated chat rooms/workspaces.
- Real-time user presence (online/offline tracking).
- Typing indicators.
- Custom brutalist UI designed for high contrast and minimal overhead.

## Local Development

The application is fully containerized. To spin up the local environment (Node server, Postgres database, and Redis instance):

1. Clone the repository:
   ```bash
   git clone https://github.com/suhaskolhe1/chat-ops.git
   cd chat-ops
   ```

2. Start the services:
   ```bash
   docker compose up --build
   ```

3. Access the application at `http://localhost:3000`.

## Testing

Unit and integration tests are written in Jest. They execute automatically in the CI pipeline.

To run them locally:
```bash
npm install
npm test
```
