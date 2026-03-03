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
    │
    └── src/
        ├── main.ts
        ├── App.vue
        │
        ├── api/
        │   ├── http.ts
        │   ├── applicationApi.ts
        │   ├── applicationsApi.ts
        │   └── authApi.ts
        │
        ├── components/
        │   ├── Header.vue
        │   ├── Footer.vue
        │   ├── LoginBox.vue
        │   ├── ApplicationBox.vue
        │   ├── ApplicationInfo.vue
        │   ├── ApplicationList.vue
        │   ├── ProfileApplicationBox.vue
        │   ├── RegisterNewAccountBox.vue
        │   └── UpgradeAccountBox.vue
        │
        ├── views/
        │   ├── ApplicantView.vue
        │   ├── ApplicationFormView.vue
        │   ├── LoginView.vue
        │   ├── ProfileView.vue
        │   ├── RecruiterView.vue
        │   ├── RegisterAccount.vue
        │   └── UpgradeAccount.vue
        │
        ├── router/
        │   └── index.ts
        │
        ├── stores/
        │   ├── authStore.ts
        │   ├── applicationsStore.ts
        │   ├── applicationStore.ts
        │   ├── registerStore.ts
        │   └── upgradeStore.ts
        │
        ├── model/
        │   └── ApplicationDTO.ts
        │
        ├── i18n/
        │   ├── index.ts
        │   ├── en.ts
        │   └── sv.ts
        │
        ├── utility/
        │   ├── applicationsResponseHandler.ts
        │   └── personNumber.ts
```

# Local dev deployment

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

# Cloud deployment

To be filled in. Not sure how we are doing this yet.

# Continued development

## How to integrate new REST API endpoints
In order to create a new REST API endpoint, developers must first create a new routing javascript page in the backend/routes folder. This page should exclusively be mapping endpoints such as /me, /login /logout to functions in the controller layer using Express, as well as implementing the authentication middleware guards to protect endpoints depending on the authorization level of the user. Example for getting all applications from the database through GET /applications/all:

```text
var router = express.Router();

router.get(
  "/all",
  authenticate,
  authorizeRoles(1),
  fetchAllApplications
);

module.exports = router;
```
As you can see in the example above, we add a .get function to our router for the endpoint "/all", and call the guard functions authenticate(), authorizeRoles(x), before then calling the actual endpoint function fetchAllApplications(). Then, in server.js where the application is mounted, we simply fetch that same router and make our app use it with a designated root endpoint such as /applications:

```text
....
var applicationsRouter = require('./src/routes/applications');
...
app.use('/applications', applicationsRouter);
```

Now, when the application is mounted (restarted), the Express router will be aware of the /applications endpoint and properly integrate the GET endpoint at /applications/all. All that remains to do now is the build the actual function in the controller layer that the endpoint maps to, while respecting the separation of concerns. The router points to the controller which handles HTTP logic, which points to the service layer which handles business logic, which points to the repository layer which performs actions on the database. Follow previous example files in these layers to see that you properly respect this separation of concerns.

## How to build new pages in the front-end. We then export the router at the end of the document.
In order to create a new page on the front-end, we work from the component level and move up all the way to the router. First, create a desired component with its desired functionality in the src/components/ folder. These are .vue objects and intgrate the Vuetify.js library which make them trivial to build upon. Simply visit the documentation for Vuetify components online (https://vuetifyjs.com/en/introduction/why-vuetify) and browse for a desired combination of components in your component. Then, integrate that component in a separate more lean .vue file in the src/views folder. Lastly, add the new view (page) to the router table in src/router/index.ts, with a desired path name as well as set parameters for the required authentication level (login required or not) as well as role authorization (role: 1 means recruiter, role: 2 means applicant):

 ```text
...
{ path: "/newPathToPage", component: NewView, meta: { requiresAuth: true, role: 1 } },
...
```

Upon restarting the dev environment the path will be integrated into the router and you can navigate to it using the url, or by calling the router object in the Vue app:
 ```text
import { useRouter } from "vue-router";
...
const router = useRouter();
router.push("/profile");
```
