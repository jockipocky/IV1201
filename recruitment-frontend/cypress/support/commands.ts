/// <reference types="cypress" />

// Custom command to log in
Cypress.Commands.add("login", (role: number = 2) => {
  // Always return a logged-in user for /auth/me
  cy.intercept("GET", "/auth/me", {
    statusCode: 200,
    body: {
      user: {
        id: 1,
        username: "testuser",
        role_id: role
      }
    }
  }).as("getAuth");

  
    cy.intercept("GET", "/applications/all", {
      statusCode: 200,
      body: {
        result: {
          applications: [
            {
              person_id: 1,
              first_name: "John",
              last_name: "Doe",
              person_number: "19900101-1234",
              email: "john@test.com",
              status: "UNHANDLED",
              competences: [
                {
                  name: "Lotteries",
                  yearsOfExperience: 2
                }
              ],
              availability: [
                {
                  fromDate: "2025-06-01",
                  toDate: "2025-06-10"
                }
              ]
            },
            {
              person_id: 2,
              first_name: "Jane",
              last_name: "Smith",
              person_number: "19920202-5678",
              email: "jane@test.com",
              status: "UNHANDLED",
              competences: [
                {
                  name: "Ticket Sales",
                  yearsOfExperience: 3
                }
              ],
              availability: [
                {
                  fromDate: "2025-07-01",
                  toDate: "2025-07-15"
                }
              ]
            }
          ]
        }
      }
    }).as("getApplications")

  // Visit profile directly
  cy.visit(role === 1 ? "/recruiter" : "/profile");

  // Wait for the auto-auth fetch to finish
  cy.wait("@getAuth");

  cy.url().should("include", role=== 1? "/recruiter":"/profile");
});

// --- TypeScript support ---
// This tells TypeScript that `cy.login()` exists
declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Custom command to log in a test user
       */
      login(role?:number): Chainable<void>;
    }
  }
}

// Make this file a module to apply the global augmentation
export {};