# Chat Ops

![CI/CD Pipeline](https://github.com/USERNAME/chat-ops/actions/workflows/ci.yml/badge.svg)

A real-time chat backend built with Node.js, Express, Socket.io, PostgreSQL, and Redis.

## Features
- Real-time messaging with WebSockets
- PostgreSQL for persistent message storage and cursor pagination
- Redis for presence tracking (online/typing status)
- JWT Authentication for secure socket connections

## Getting Started

Start the complete stack (app, postgres, redis) using Docker Compose:

```bash
docker compose up
```

The server will start on `http://localhost:3000`. Open `index.html` in your browser to test it out!
