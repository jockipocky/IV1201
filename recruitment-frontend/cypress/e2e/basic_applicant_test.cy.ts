describe("Application form", () => {

  beforeEach(() => {
    cy.login(); // ensures user is logged in and on /profile

    // Stub the POST /applications (submit) to succeed
    cy.intercept("POST", "/applications", {
      statusCode: 200,
      body: { success: true }
    }).as("submitApplication");

    cy.intercept("GET", "/auth/me", {
      statusCode: 200,
      body: {
        user: {
          id: 1,
          username: "testuser",
          role_id: 2
        }
      }
    }).as("auth/me");

    // Stub the GET /applications/* (fetch after reload)
    cy.intercept("GET", "/applications/*", {
      statusCode: 200,
      body: {
        success: true,
        competenceProfile: [
          { competenceType: "lotteries", competenceTime: 2 }
        ],
        availability: [
          { from_date: "2025-06-01T00:00:00", to_date: "2025-06-10T00:00:00" }
        ]
      }
    }).as("getApplication");
  });

  it("submits a new application", () => {
    cy.get('[data-cy="competence-select"]').first().click();
    cy.contains('.v-list-item', 'Lotteries').click();

    cy.get('[data-cy="experience-input"]').first().type("2");

    cy.get('[data-cy="apply-button"]').click();

    // Wait for POST and GET after reload
    cy.wait("@submitApplication");
    cy.wait("@auth/me")

  });
});