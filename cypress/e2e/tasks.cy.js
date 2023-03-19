/// <reference types="cypress" />

describe("tasks", () => {
  let testData;

  before(() => {
    cy.fixture("tasks").then((t) => {
      testData = t;
    });
  });

  context("register", () => {
    it("should register a new task", () => {
      const taskName = "Read a Node.js book";

      cy.removeTaskByName(taskName);
      cy.createTask(taskName);
      cy.contains("main div p", taskName).should("be.visible");
    });

    it("should not allow duplicated tasks", () => {
      const task = testData.dup;

      cy.removeTaskByName(task.name);

      // Given that I have one duplicated task
      cy.postTask(task);

      // When registering the same task again
      cy.createTask(task.name);

      // Then the duplicated message should be displayed
      cy.get(".swal2-html-container")
        .should("be.visible")
        .should("have.text", "Task already exists!");
    });

    it("required field", () => {
      cy.createTask();

      cy.isRequired("This is a required field");
    });
  });

  context("update", () => {
    it("should mark task as done", () => {
      const task = {
        name: "Buy ketchup",
        is_done: false,
      };

      cy.removeTaskByName(task.name);
      cy.postTask(task);

      cy.visit("/");

      cy.contains("p", task.name)
        .parent()
        .find("button[class*=ItemToggle]")
        .click();

      cy.contains("p", task.name).should(
        "have.css",
        "text-decoration-line",
        "line-through"
      );
    });
  });

  context("deletion", () => {
    it("should remove a task", () => {
      const task = {
        name: "Study JavaScript",
        is_done: false,
      };

      cy.removeTaskByName(task.name);
      cy.postTask(task);

      cy.visit("/");

      cy.contains("p", task.name)
        .parent()
        .find("button[class*=ItemDelete]")
        .click();

      cy.contains("p", task.name).should("not.exist");
    });
  });
});
