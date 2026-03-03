# About this project
This project is a monolithic cloud-based recruitment system built using a client–server architecture. It consists of a client-side rendered Single Page Application (SPA) developed with Vue.js, and a stateless REST API backend built with Node.js and Express. The goal of the system is to follow modern industry standards while remaining maintainable, scalable, and easy to extend.

## Architecture Overview

The system is divided into two main parts:

### Frontend (Vue.js SPA)

* Built with Vue.js and Vite

* Uses Pinia for state management

* Uses Axios for HTTP communication

* Uses Vuetify for UI components

* Uses MDI for iconography

* Uses ESLint for code quality and error prevention

The frontend is responsible for presentation logic and user interaction, and communicates with the backend via HTTPS using a RESTful JSON API. Since the frontend and backend are deployed as separate cloud services, CORS is enabled to allow secure communication. The frontend loosely follows an MVVM/MVP-inspired structure, separating views, state management, and business logic.

### Backend (Express REST API)
The backend is implemented as a stateless REST API and follows a layered architecture to clearly separate responsibilities:

* Routes / Communication layer – Routes endpoints to functions

* Controller layer - Handles HTTP requests, responses and validates authentication and authorization

* Service layer – Implements business logic

* Repository layer – Handles database access

* Domain layer – Contains system entities (e.g., users, applications)

The backend is responsible for authentication and authorization, account and session management using jwt and cookies, handling job applications, validation, transaction handling, and database communication. All persistent data is stored in a managed PostgreSQL database hosted on Heroku.

### Deployment and Cloud Strategy

The system is designed to be deployed as separate cloud services (frontend and backend), enabling horizontal scaling and independent updates. The backend acts as the single entry point to the data layer and enforces business rules. This architecture also allows for future expansion, such as adding a mobile client that can reuse the same REST API without any issues. Vue applications can also be compiled to run as Android and Desktop applications using frameworks such as Electron.

We intend to host both the front-end and back-end using heroku but have not finalized this as of writing this README.

# Project structure and file hierarchy
```text
.
├── package.json
├── package-lock.json
├── README.md
│
├── recruitment-backend/
│   ├── server.js
│   ├── hashMigrationSingleUse.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   │
│   ├── bin/
│   │   └── www
│   │
│   ├── public/
│   │   └── stylesheets/
│   │       └── style.css
│   │
│   │
│   └── src/
│       ├── controllers/
│       │   ├── applicationController.js
│       │   ├── applicationsController.js
│       │   └── authController.js
│       │
│       ├── services/
│       │   ├── applicationService.js
│       │   ├── applicationsService.js
│       │   └── authService.js
│       │
│       ├── repository/
│       │   ├── applicationQuery.js
│       │   ├── applicationsQuery.js
│       │   └── authQuery.js
│       │
│       ├── db/
│       │   └── db.js
│       │
│       ├── domain/
│       │   ├── ApplicationDTO.js
│       │   └── UserDTO.js
│       │
│       ├── middleware/
│       │   └── authMiddleware.js
│       │
│       └── routes/
│           ├── applicationRoutes.js
│           ├── applications.js
│           └── auth.js
│
└── recruitment-frontend/
    ├── package.json
    ├── package-lock.json
    ├── vite.config.ts
    ├── vitest.config.ts
    ├── cypress.config.ts
    ├── index.html
    ├── .env
    │
    ├── public/
    │   └── favicon.ico
    │
    ├── cypress/
    └── src/
        ├── main.ts
        ├── App.vue
        ├── api/
        ├── components/
        ├── views/
        ├── router/
        ├── stores/
        ├── model/
        ├── i18n/
        ├── utility/
        └── __tests__/
            └── App.spec.ts
```

# Local development setup

## Prerequisites
Make sure you have Node.js installed as well as PostgreSQL. Make sure the PostgreSQL server is up and running and accepting connections. For this project, it is hosted on Heroku, and the connection string should have been handed over to you by your project responsible.

## Flow
### Back-end
First navigate to the back-end directory and install dependencies:

```text
cd recruitment-backend
npm install
```

Then create a .env file inside recruitment-backend/ containing the PostgreSQL connection string, jwt secret for creating authentication cookies, and more:

```text
DATABASE_URL=postgres://username:password@localhost:5432/database_name
NODE_ENV=development
JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=1h
```

Then run your back-end, it should host on localhost:3000 by default:

```text
npm start
```

### Front-end
First navigate to the front-end directory and install dependencies:
```text
cd recruitment-frontend
npm install
```

Then create a .env file inside recruitment-frontend/ containing the REST API connection string:

```text
VITE_API_BASE_URL=http://localhost:3000/
```

Then run your front-end, it should host on localhost:5173 by default:

```text
npm run dev
```
