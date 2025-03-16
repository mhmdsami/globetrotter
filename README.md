# globetrotter

Fun guess the place challenge with fun facts and trivia

## Getting Started

### Fork and clone the repository

- [Fork](https://github.com/mhmdsami/globetrotter/fork) this repository
- Clone the forked repository

```
git clone https://github.com/<your-username>/globetrotter.git
```

### Setup
The repo consists of two parts [www](/www)(the application) and [server](/server)(the api)

### Application

```
# install deps
npm install

# setup .env
cp .env.example .env.local

# run dev server
npm run dev
```

### Server

```
# install deps
npm install

# setup .env
cp .env.example .env

# run dev server
npm run dev
```
> [!WARNING]
> Server will fail to start without `DATABASE_URL` being set

## API Documentation
See this [postman](https://documenter.getpostman.com/view/28998954/2sAYkBt1sh) collection for the api documentation

## Tech Stack

- [React](https://react.dev/)
- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Hono](https://hono.dev/)
- [Prisma](https://www.prisma.io/)
- [MongoDB](https://www.mongodb.com/)
- [TypeScript](https://www.typescriptlang.org/)
