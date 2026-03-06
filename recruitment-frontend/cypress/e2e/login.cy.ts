describe("Login flow", () => {

  it("logs in successfully", () => {

    //catch the auto authenticate which will obviously fail
    cy.intercept("GET", "/auth/me", {
      statusCode: 200,
      body: { user: null }
    })

    //catch the login with a fake user just to see redirect happens
    cy.intercept("POST", "/auth/login", {
      statusCode: 200,
      body: {
        user: {
          id: 1,
          username: "testuser",
          role_id: 2
        }
      }
    }).as("login")

    cy.visit("/login")

    cy.get("input").eq(0).type("testuser")
    cy.get("input").eq(1).type("password")

    cy.get('[data-cy="login-button"]').click()

    cy.wait("@login")

    cy.url().should("include", "/profile")

  })

})

//check auto redirect works
describe("Route protection", () => {

  it("redirects unauthenticated users to login", () => {

    cy.intercept("GET", "/auth/me", {
      statusCode: 200,
      body: { user: null }
    })

    cy.visit("/profile")

    cy.url().should("include", "/login")

  })

})