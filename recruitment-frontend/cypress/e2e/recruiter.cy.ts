describe("Recruiter view", () => {

  beforeEach(() => {

    cy.login(1) // recruiter login

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

    cy.intercept("PUT", "/applications/*/status", {
      statusCode: 200
    }).as("handleApplication")

  })


  it("loads and displays applications", () => {

    //cy.visit("/recruiter")

    cy.wait("@getApplications")

    cy.contains("John Doe")
    cy.contains("Jane Smith")

  })


  it("expands an application", () => {

    cy.visit("/recruiter")

    cy.wait("@getApplications")

    cy.contains("John Doe").click()

    cy.contains("19900101-1234")
    cy.contains("john@test.com")
    cy.contains("Lotteries")
    cy.contains("2025-06-01")

  })


  it("accepts an application", () => {

    cy.visit("/recruiter")

    cy.wait("@getApplications")

    cy.contains("John Doe").click()

    cy.get('[data-cy="accept-button"]').click()

    cy.wait("@handleApplication")

    cy.contains("accepted", { matchCase: false })

  })


  it("declines an application", () => {

    cy.visit("/recruiter")

    cy.wait("@getApplications")

    cy.contains("Jane Smith").click()

    cy.contains("button", "Decline").click()

    cy.wait("@handleApplication")

    cy.contains("rejected", { matchCase: false })

  })

})