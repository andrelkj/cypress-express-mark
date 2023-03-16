/// <reference types="cypress" />

describe('empty spec', () => {
  it('Webapp should be online', () => {
    cy.visit('http://localhost:8080')

    cy.title().should('eq', 'Gerencie suas tarefas com Mark L')
  })
})