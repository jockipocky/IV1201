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

More about the cloud deployment later in this file. We have chosen to host the frontend using Vercel and backend using Railway. This is combined with our database which is hosted on Heroku.

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
The system follows a **client–server architecture** where the frontend, backend, and database are deployed on separate cloud platforms.

- The **frontend** is a Vue.js **Single Page Application (SPA)** hosted on **Vercel**.
- The **backend** is a **Node.js Express REST API** hosted on **Railway**.
- The **database** is a **PostgreSQL instance** hosted on **Heroku**.

API requests from the frontend are routed through a **Vercel proxy (`/api`)**, which forwards requests to the backend service. This allows the frontend and backend to communicate securely while enabling **authentication cookies** to function correctly.

---

### Production URLs

#### Frontend
```
https://frontend-deploy-coral.vercel.app
```

#### Backend API
```
https://iv1201-production.up.railway.app
```

---

### Environment Variables

Both **Vercel** and **Railway** use environment variables to configure the deployed services.

These correspond to the `.env` variables used in local development. When deploying the system, these variables must also be added in the respective cloud platform dashboards.

---

### Frontend (Vercel)

```
VITE_API_BASE_URL=/api
```

This ensures the frontend sends API requests through the **Vercel proxy**, which then forwards them to the backend.

---

### Backend (Railway)

```
DATABASE_URL=<postgres connection string>
JWT_SECRET=<secret used to sign authentication tokens>
NODE_ENV=production
```

- **DATABASE_URL** – connection string used to access the PostgreSQL database  
- **JWT_SECRET** – secret key used for signing authentication tokens  
- **NODE_ENV** – ensures the backend runs in production mode

---

### Deployment Process

Both the frontend and backend are configured for **automatic deployment**.

When changes are pushed to the **deployment branch on GitHub**:

1. **Vercel** automatically rebuilds and deploys the frontend.
2. **Railway** automatically rebuilds and deploys the backend.

This ensures that the **latest version of the system is deployed without manual intervention**.

# Continued development

## How to integrate new REST API endpoints
In order to create a new REST API endpoint, developers must first create a new routing javascript page in the backend/src/routes folder. This page should exclusively be mapping endpoints such as /me, /login /logout to functions in the controller layer using Express, as well as implementing the authentication middleware guards to protect endpoints depending on the authorization level of the user. Example for getting all applications from the database through GET /applications/all:

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
Importantly, we export the router at the end of the document. As you can see in the example above, we add a .get function to our router for the endpoint "/all", and call the guard functions authenticate(), authorizeRoles(x), before then calling the actual endpoint function fetchAllApplications(). Then, in server.js where the application is mounted, we simply fetch that same router and make our app use it with a designated root endpoint such as /applications:

```text
....
var applicationsRouter = require('./src/routes/applications');
...
app.use('/applications', applicationsRouter);
```

Now, when the application is mounted (restarted), the Express router will be aware of the /applications endpoint and properly integrate the GET endpoint at /applications/all. All that remains to do now is the build the actual function in the controller layer that the endpoint maps to, while respecting the separation of concerns. The router points to the controller which handles HTTP logic, which points to the service layer which handles business logic, which points to the repository layer which performs actions on the database. Follow previous example files in these layers to see that you properly respect this separation of concerns.

## How to build new pages in the front-end.
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
### Integrating the Pinia reactive state store
The app uses Pinia for its reactive state management. This means that if you want access to reactive objects you must first create a store (or re-use other stores if the concerns overlap) in the /src/stores/ folder. These stores implement a state, actions and getters. Follow the examples in the previous files or visit the official Pinia documentation to see syntax rules. 

To use the reactive values from our stores in a component, we import them in the script section of our .vue files and then make sure we let the component know that they are reactive and need to be continuously computed. There are many ways to accomplish this using Vue, but one example you can follow is:

 ```text
//first import the store
import { useApplicationsStore } from "@/stores/applicationsStore";
//instantiate it
const store = useApplicationsStore();
//call an action in the store
store.fetchAllApplications();
//read a value from the store reactively, in this case array of DTOs
const applications = computed<ApplicationDTO[] | null>(() => store.applicationsResult);
```

This assures that the const "applications" exposed to the template section of the Vue component is both fetched from the store and updated whenever changed, such that those changes are immediately reflected on the page where the applications are displayed.

# Browser testing using Cypress

In order to perform browser testing for this project we use Cypress for the front-end for Chrome, Edge and Firefox, found in recruiment-frontend/cypress , as well as manual testing for Safari and mac users. In order to run the automatic Cypress tests, simply make sure you have installed all dependencies:

 ```text
npm install
```

And then run either the visual browser-tester showing you a playback of the tests being performed:

 ```text
npx cypress open
```

Or simply run all tests found in the cypress/e2e folder for a specific browser. Options here include Chrome, Firefox, Edge and Electron. Note that the browser in question needs to be locally installed on your computer for this command to work.

 ```text
npx cypress run --browser=chrome
```

## To add new tests

In order to add new tests to the repertoir of Cypress scripts, simply make a new *.cy.ts file in the e2e folder, following the same structure as the previous ones. Note that you need to intercept request sent to the backend and return dummy respses instead, since the tests will not run using real user data. Make note of the shape of incoming responses and structure your dummy response accordingly. After having created this Cypress script, it will automatically run together with all other scrips in the folder upon issuing the previously listed command.

## Checklist for manual testing for Safari

Cypress does not support Safari as a browser for automatic tests, and our project group only had one Mac user. For this reason we thought it would be better, considering the small size of the project, to let Mac testing be done manually. As a rule, these tests should be performed before any build is shipped to the deployed product. To properly perform Mac testing, use the following step by step guide to make sure everything works as it should:

1. Navigate to the base/login page. Verify that: the URL endpoints / and /login both take you here. The url endpoints /profile and /recruiter both also take you here since you are not yet logged in.
2. Then, attempt to login using bogus login info. Verify that an error message appeared and that it appeared in the correct chosen language. Verify that you did not leave the login page.
3. Then, attempt to click on "Sign up now". Verify that it takes you to the endpoint /register. Verify that upon refreshing the page, you are still on this page.
4. Then, attempt to submit an empty request. Verify that you receive the appropriate error about all fields needing to be filled and in your chosen language.
5. Then, attempt to fill in your request. Verify that the personal number field only accepts personal numbers in the correct shape. Verify that the password field requires you to submit a password with at least 8 characters.
6. Then, submit your application and verify that (given correct shaped inputs) you receive a confirmation message and are redirected to the login page.
7. Then, click on the "Upgrade legacy account" button on the login page and verify that it takes you to the /upgrade endpoint in the URL on screen. Verify that upon refreshing the page, you stay on this screen.
8. Then, attempt to submit an empty form on this upgrade page. Verify that you get an error message indicating that all fields are required. Attempt to submit the form missing any field, and verify that it won't let you. Then, verify that you can't upgrade an account for which you do not have a legacy code by submitting a dummy code for a real upgradable account. Then, verify with the help of a dummy account in the database that you can in fact upgrade an account if the information is correct. Verify that you receive confirmation on the page that the upgrade worked.
9. Then, use the "Return to login" button and verify that it correctly takes you back to the login page, and log in using your created account.
10. Then, verify that the user you created has their personal info displayed on the top of the page, that you can edit that info, and that the updated info persists upon refreshing the page.
11. Then, attempt to submit competence profile and availability and verify that it properly updates and persists upon refresh.
12. Then, verify that if you manually navigate to /login or / or /register or /upgrade - the page redirects you to /profile since you are currently logged in with an auth cookie.
13. Then, log out using the header and verify that it directs you to the login page. Check your cookie storage and make sure it has been emptied. Refresh the page and verify that you stay logged out.
14. Then, log in to a recruit account (create one in the database or use a login you know) and verify that it redirects you to /recruiter. Manually visit /, /register and /upgrade again to make sure they redirect you to /recruiter.
15. Then, verify that applications appear in the list, that their info is displayed properly when expanded, and that you can properly accept or decline applications.
16. Then, set the person_application_status of a user to REJECTED in the database manually, before attempting to accept them locally in your app. Verify that you get the appropriate error message saying that another recruiter has already handled that application, and verify that the status field on the page has been updated to their already-handled status.
17. Lastly, log out using the header and verify again that the cookie has been deleted from your cookie storage and that refreshing the page does not log you back in.
