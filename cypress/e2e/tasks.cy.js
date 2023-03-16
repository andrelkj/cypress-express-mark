/// <reference types="cypress" />

describe("tasks", () => {
  it("should register a new task", () => {
    cy.visit("http://localhost:8080");

    cy.get('input[placeholder="Add a new Task"]').type("Read a node.js book");

    cy.contains('button', 'Create').click()
  });
});
