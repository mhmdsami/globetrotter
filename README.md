# globetrotter

Fun guess the place challenge with fun facts and trivia

![image](https://github.com/user-attachments/assets/8c1aea6f-4af6-4aa4-95b7-74fbe3a8f621)

![image](https://github.com/user-attachments/assets/5f2388a5-9b36-40b7-b2bd-23db2eef3ae2)

## Getting Started

### Fork and clone the repository

- [Fork](https://github.com/mhmdsami/globetrotter/fork) this repository
- Clone the forked repository

```
git clone https://github.com/<your-username>/globetrotter.git
```

### Setup
The repo consists of two parts [www](/www) (the application) and [server](/server) (the api)

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

- [React](https://react.dev/) <br /> To build extensible components and the framework I am most confident with
- [Next.js](https://nextjs.org/) <br /> For built-in routing and few other hooks, honestly not extensively used
- [TailwindCSS](https://tailwindcss.com/) <br /> Helps with prototype and move faster, especially when I don't have design
- [Hono](https://hono.dev/) <br /> The only reason for me to choose hono over express is for its typesafety, although hono is lightweight and more performant
- [MongoDB](https://www.mongodb.com/) <br /> The data stored in this app is _mostly_ of a object/doument format and also I did not want to worry about migrations
- [Prisma](https://www.prisma.io/) <br /> An ORM (ODM), again for typesafety and clean api to interact with the database
- [TypeScript](https://www.typescriptlang.org/) <br /> of course its Typesafety! again
