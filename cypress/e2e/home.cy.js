/// <reference types="cypress" />

describe('empty spec', () => {
  it('Webapp should be online', () => {
    cy.visit('/')

    cy.title().should('eq', 'Gerencie suas tarefas com Mark L')
  })
})