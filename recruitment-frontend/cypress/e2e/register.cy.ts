describe('Registration Page', () => {
  beforeEach(() => {
    cy.visit('/register') // adjust route if needed
  })

  it('renders the registration form correctly', () => {
    cy.get('[data-cy="register-firstname"]').should('exist')
    cy.get('[data-cy="register-lastname"]').should('exist')
    cy.get('[data-cy="register-email"]').should('exist')
    cy.get('[data-cy="register-personnumber"]').should('exist')
    cy.get('[data-cy="register-username"]').should('exist')
    cy.get('[data-cy="register-password"]').should('exist')
    cy.get('[data-cy="register-button"]').should('exist')
    cy.get('[data-cy="register-back"]').should('exist')
  })

  it('allows typing in all fields', () => {
    cy.get('[data-cy="register-firstname"] input').type('Andre')
    cy.get('[data-cy="register-lastname"] input').type('Test')
    cy.get('[data-cy="register-email"] input').type('andre@test.com')
    cy.get('[data-cy="register-personnumber"] input').type('19900101-1234')
    cy.get('[data-cy="register-username"] input').type('andreuser')
    cy.get('[data-cy="register-password"] input').type('password123')

    cy.get('[data-cy="register-firstname"] input').should('have.value', 'Andre')
    cy.get('[data-cy="register-lastname"] input').should('have.value', 'Test')
    cy.get('[data-cy="register-email"] input').should('have.value', 'andre@test.com')
    cy.get('[data-cy="register-personnumber"] input').should('have.value', '19900101-1234')
    cy.get('[data-cy="register-username"] input').should('have.value', 'andreuser')
    cy.get('[data-cy="register-password"] input').should('have.value', 'password123')
  })


  it('shows error alert when registration fails', () => {
    // Example: submit without filling fields
    cy.get('[data-cy="register-button"]').click()
    cy.get('[data-cy="register-error"]').should('exist')
  })

  it('navigates back to login', () => {
    cy.get('[data-cy="register-back"]').click()
    cy.url().should('include', '/login')
  })
})