
---

```markdown
# 🤖 AI Tool Hub

A full-stack Next.js application designed to help users discover, save, and learn about the rapidly growing ecosystem of AI tools. Whether you are looking for text generators, image creators, or productivity boosters, this hub lets you explore tools, bookmark your favorites, and watch relevant YouTube tutorials all in one place.

## ✨ Core Features

* 🔍 **Discover AI Tools:** Browse a curated directory of AI tools tailored to different workflows and use cases.
* 🔖 **Personal Bookmarks:** Create an account to save and manage your favorite AI tools in a personalized dashboard for quick access.
* 📺 **Integrated YouTube Learning:** Each tool features linked YouTube tutorials and reviews so you can see it in action before trying it out.
* 🔒 **Robust Authentication:** * Secure User Signup and Login.
    * Real-time, interactive password strength validation.
    * Enterprise-grade, token-based password recovery flow.

## 🛠️ Tech Stack

* **Frontend & Framework:** Next.js (App Router, Server Actions, Server/Client Components)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (Dark mode optimized)
* **Database:** PostgreSQL
* **ORM:** Prisma (using `@prisma/adapter-pg` and the `pg` driver for edge-ready connection pooling)
* **Security:** `bcryptjs` for password hashing, Node `crypto` for secure token generation.
* **Package Manager:** `pnpm`

## 🚀 Getting Started

### Prerequisites
Ensure you have Node.js and `pnpm` installed on your machine.

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd ai-tool-hub
pnpm install

```

### 2. Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
# Your PostgreSQL Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/yourdb"

# The base URL of your application (Change for production)
APP_URL="http://localhost:3000"

# Add any other required keys here (e.g., YouTube API Key if applicable)

```

### 3. Database Initialization

Push the Prisma schema to your PostgreSQL database to create the required tables (Users, Tools, Bookmarks, etc.).

```bash
pnpm prisma db push

```

### 4. Run the Development Server

```bash
pnpm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to start exploring.

## 🔐 Architecture Notes: Security & Database Management

This project implements advanced Next.js and database patterns:

* **HMR-Safe Database Pooling:** Custom Prisma initialization using the `pg` Pool wrapper ensures that Next.js Hot Module Replacement (HMR) during local development does not exhaust PostgreSQL connection limits.
* **Secure Password Resets:** The forgotten password flow utilizes cryptographically secure, time-limited tokens that are hashed in the database. To facilitate local testing without an email provider, the app dynamically routes tokens to the frontend UI in development mode.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

```

***


```
