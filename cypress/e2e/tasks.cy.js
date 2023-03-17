/// <reference types="cypress" />

describe("tasks", () => {
  it("should register a new task", () => {
    cy.request({
      url: "http://localhost:3333/helper/tasks",
      method: "DELETE",
      body: { name: "Read a Node.js book" },
    }).then((response) => {
      expect(response.status).to.eq(204);
    });

    cy.visit("http://localhost:8080");

    cy.get('input[placeholder="Add a new Task"]').type("Read a Node.js book");

    cy.contains("button", "Create").click();

    cy.contains ('main div p', 'Read a Node.js book')
      .should('be.visible')
  });
});
