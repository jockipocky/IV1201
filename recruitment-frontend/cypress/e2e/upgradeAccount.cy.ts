describe('Upgrade Account Page', () => {
  beforeEach(() => {
    cy.visit('/upgrade')
  })

  it('renders all fields and buttons', () => {
    cy.get('[data-cy="upgrade-email"]').should('exist')
    cy.get('[data-cy="upgrade-personnumber"]').should('exist')
    cy.get('[data-cy="upgrade-code"]').should('exist')
    cy.get('[data-cy="upgrade-username"]').should('exist')
    cy.get('[data-cy="upgrade-password"]').should('exist')
    cy.get('[data-cy="upgrade-submit"]').should('exist')
    cy.get('[data-cy="upgrade-back"]').should('exist')
  })

  it('allows typing in all fields', () => {
    cy.get('[data-cy="upgrade-email"] input').type('andre@test.com')
    cy.get('[data-cy="upgrade-personnumber"] input').type('19900101-1234')
    cy.get('[data-cy="upgrade-code"] input').type('UPGRADE123')
    cy.get('[data-cy="upgrade-username"] input').type('andreuser')
    cy.get('[data-cy="upgrade-password"] input').type('password123')

    cy.get('[data-cy="upgrade-email"] input').should('have.value', 'andre@test.com')
    cy.get('[data-cy="upgrade-personnumber"] input').should('have.value', '19900101-1234')
    cy.get('[data-cy="upgrade-code"] input').should('have.value', 'UPGRADE123')
    cy.get('[data-cy="upgrade-username"] input').should('have.value', 'andreuser')
    cy.get('[data-cy="upgrade-password"] input').should('have.value', 'password123')
  })


  it('shows error alert when submitting invalid form', () => {
    cy.get('[data-cy="upgrade-submit"]').click()
    cy.get('[data-cy="upgrade-error"]').should('exist')
  })

  it('navigates back to login', () => {
    cy.get('[data-cy="upgrade-back"]').click()
    cy.url().should('include', '/login')
  })
})