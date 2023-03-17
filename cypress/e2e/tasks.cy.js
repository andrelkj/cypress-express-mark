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

    cy.contains("main div p", "Read a Node.js book").should("be.visible");
  });

  it("should not allow duplicated tasks", () => {
    const task = {
      name: "Study JavaScript",
      is_done: false,
    };

    cy.request({
      url: "http://localhost:3333/helper/tasks",
      method: "DELETE",
      body: { name: task.name },
    }).then((response) => {
      expect(response.status).to.eq(204);
    });

    // Given that I have one duplicated task
    cy.request({
      url: "http://localhost:3333/tasks",
      method: "POST",
      body: task
    }).then((response) => {
      expect(response.status).to.eq(201);
    });

    // When registering the same task again
    cy.visit("http://localhost:8080");

    cy.get('input[placeholder="Add a new Task"]').type(task.name);

    cy.contains("button", "Create").click();

    // Then the duplicated message should be displayed
    cy.get(".swal2-html-container")
      .should("be.visible")
      .should("have.text", "Task already exists!");
  });
});
