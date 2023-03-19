# Cypress

On this course we'll be automating a web application with Cypress, in order to do it we'll need to:

1. Create the [project file](../cypress-express-mark/)
2. Initialize node.js (`yarn init`), entering all required information
3. Install cypress as a development dependency (`yarn add cypress -D`) - we're using cypress 12.2.0
4. After all that we should be ready to open it (`yarn cypress open`)

**OBS.:** we're using yarn instead of npm because of it's increased performance.

After all that we'll install and execute yarn to start our API and web server. Note that both front-end and back-end environments should be running in order to use the application.

## Structure

Cypress uses mocka structure meaning that every describe is a suite case, and every it defines a test case:

Here's an example with a test suite (home) with one test case (Webapp should be online):

```
describe('home', () => {
  it('Webapp should be online', () => {
    cy.visit('http://localhost:8080')

    cy.title().should('eq', 'Manage your tasks with Mark L')
  })
})
```

**OBS.:** while writting in cypress we should avoid:

- Using 'its' to create steps, each 'it' should refer to a single test case
- Creating dependent test cases, each and every test case should be independent from one another

### tasks.cy.js - input validation

Cypress can find elements inside the page through css selector. Although for this to work properly the application must have a good css element selectors.

In this example cypress found the input field by its id:

```
cy.get('#newTask')
```

**OBS.:** # is used to identify elements by id.

When css selectors are not well identified and/or structured we need to add selectors manually. Some good properties to consider as selector is placeholder and name.

#### Faker

Faker can be used to generate dynamic random data which solve the repetitive and fixed data problem, although it now generates a new issue once it generate massive entries of information and at least for now do not meet our requirements to fill the input with tasks.

### API DELETE Request

We're not gonna be using faker in here. Instead we'll use fixed data trying a new approach to solve repetitive information issue by deleting data through API.

To do it we'll:

1. Install insomnia to manage our APIs
2. Here we should have a DELETE request by id, although we cannot access the id through application so a new path (http://localhost:3333/helper/tasks) was create in order to allow deletion by name which will receive the task string as value

**OBS.:** the new deletion by name should only work into dev environment once it's just a test tool.

3. After all that we'll then automate all API requests with cypress to delete the task, allowing the application to reset tasks before every test execution and then validate the returned request response status

```
cy.request({
  url: 'http://localhost:3333/helper/tasks',
  method: 'DELETE',
  body: {name: 'Read a Node.js book'}
}).then(response => {
  expect(response.status).to.eq(204)
})
```

**OBS.:** the deletion should also be executed first in order to prepare the environment for the test execution, allowing us to analyse and validate the end result with a created task.

### Expected behavior validation

In here we'll validate if the task was actually created and added to the list, being displayed properly.

In order to do so we'll:

1. Get the element from css selector
2. Validate if it is visible
3. Validate the displayed text

```
cy.get("main div p")
  .should("be.visible")
  .should("have.text", "Read a Node.js book");
```

This should word although we're using the main element as selector so once a new item is added to the list our test should break because we're only considering one item of the hole component and now we'll have two or more inside of it.

### Xpath

Cypress do not support xpath selectors, although it has it's own functions to identify elements. For example:

Considering the xpath `//button[contains(text(), "Create")]` to identify the Create button we would use cypress function:

```
cy.contains('button', 'Create').click()
```

This would not only find the locator but also execute the click function on it.

### Validating duplicated task

In order to allow dynamic validation to duplicated task we're going to add API requests to register que first entry and then validating it's recreation once more through IDE:

1. First we're adding the task through an API POST request:

```
    // Given that I have one duplicated task
    cy.request({
      url: "http://localhost:3333/helper/tasks",
      method: "POST",
      body: { name: "Study JavaScript", is_done: false },
    }).then((response) => {
      expect(response.status).to.eq(201);
    });
```

2. We're adding the same task once more through IDE:

```
    // While registering the same task again
    cy.visit("http://localhost:8080");

    cy.get('input[placeholder="Add a new Task"]').type("Study JavaScript");

    cy.contains("button", "Create").click();
```

3. And validating the duplicated task alert message:

```
    // Then the duplicated message should be displayed
    cy.get(".swal2-html-container")
      .should("be.visible")
      .should("have.text", "Task already exists!");
```

**OBS.:** by doing this we should be able to validate the duplicated task scenario, although once the task is created running the test again will break, so we need to add the DELETE request to the API as well before executing it.

```
  it.only("should not allow duplicated tasks", () => {
    cy.request({
      url: "http://localhost:3333/helper/tasks",
      method: "DELETE",
      body: { name: "Study JavaScript" },
    }).then((response) => {
      expect(response.status).to.eq(204);
    });

    // Given that I have one duplicated task
    cy.request({
      url: "http://localhost:3333/tasks",
      method: "POST",
      body: { name: "Study JavaScript", is_done: false },
    }).then((response) => {
      expect(response.status).to.eq(201);
    });

    // While registering the same task again
    cy.visit("http://localhost:8080");

    cy.get('input[placeholder="Add a new Task"]').type("Study JavaScript");

    cy.contains("button", "Create").click();

    // Then the duplicated message should be displayed
    cy.get(".swal2-html-container")
      .should("be.visible")
      .should("have.text", "Task already exists!");
  });
```

#### Variables and constants

Variables can be used to define changable values, while constants define imutable values. Both can be used to identify a value and allow easier maintenance when change is needed.

Here we're defining the const task which will containt values for name and is_done and then using the hole element or a piece of information inside of it (task.name):

```
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
```

**OBS.:** by doing that code will look for the values inside the variable or constant and use those values as input.

#### Encapsulation

We use encapsulation to diminish usage of repetitive elements. In order to do so we:

1. Create cypress commands which will contain all necessary steps to execute the steps.

Command to create a new task:

```
Cypress.Commands.add("createTask", (taskName) => {
  cy.visit("http://localhost:8080");

  cy.get('input[placeholder="Add a new Task"]').type(taskName);

  cy.contains("button", "Create").click();
});
```

Command to remove a task by it's name:

```
Cypress.Commands.add('removeTaskByName', (taskName) => {
  cy.request({
    url: "http://localhost:3333/helper/tasks",
    method: "DELETE",
    body: { name: taskName },
  }).then((response) => {
    expect(response.status).to.eq(204);
  });
})
```

Command to create a new task through API POST request:

```
Cypress.Commands.add('postTask', (task) => {
  cy.request({
    url: "http://localhost:3333/tasks",
    method: "POST",
    body: task,
  }).then((response) => {
    expect(response.status).to.eq(201);
  });
})
```

2. We now need to change the repetitive steps for the command name, entering the argument it should consider (taskName):

```
  it("should register a new task", () => {
    const taskName = "Read a Node.js book";

    cy.removeTaskByName(taskName);
    cy.createTask(taskName);
    cy.contains("main div p", taskName).should("be.visible");
  });
```

3. After all we store all our created commands to the [support commands file](cypress/support/commands.js) to keep it organized.

**OBS.:** encapsulation is a best practice that allow better steps definition and reuse through test cases.

### Required field validation

One possible scenario is to create a task without a name. It should display a required field alert message. In order to do it we'll use the previous commands defined to create a new task and add a condition to it so when name is empty it won't input information, but when it isn't the task name will be typed in.

1. We defined an empty value as standard to the taskName variable `Cypress.Commands.add("createTask", (taskName = '') => `
2. Then we added the condition to fill the field only if the task name isn't empty

```
  if (taskName !== '') {
  cy.get('input[placeholder="Add a new Task"]').type(taskName);
  }
```

3. Now we created a test case which create a task without a name value

```
  it('required field', () => {
    cy.createTask()
  })
```

**OBS.:** this should allow testing empty named tasks without breaking our other scenarios.

After all that we now need to validate the alert message displayed, although this cannot be used as selector once it's a browser behavior for required inputs and not a pop-up or modal created through HTML/CSS. So how should we validate it?

We'll use cypress invoke function which allow us to validate a defined property of an element against it's expected output:

```
    cy.get('input[placeholder="Add a new Task"]')
      .invoke("prop", "validationMessage")
      .should((text) => {
        expect("This is a required field").to.eq(text);
      });
```

We'll also encapsulate it inside a new command:

```
Cypress.Commands.add('isRequired', (targetMessage) => {
  cy.get('@inputTask')
  .invoke("prop", "validationMessage")
  .should((text) => {
    expect(targetMessage).to.eq(text);
  });
})
```

**OBS.:** in cypress we can store selectors inside variables by using `cy.get('input[placeholder="Add a new Task"]').as('inputTask')` so now everytime `@inputTask` is used it will refer to the input placeholder selector. Note: @ is important for cypress to understand the reference.

### Validating tasks done

Here we're validating the CSS when a task is completed. In order to do it we need to consider that Xpath cannot be used inside Cypress so we're using it's internal functions once more:

1. We'll define a new update contexto which will contain the task conclusion scenario;
2. We'll enter the local path in order to access the page (http:localhost:8080)
3. And enter the element it needs to find and take action on:

To use cypress internal locators we'll add:
.contains which will try finding elements with the entered properties inside all HTML/CSS elements.
.parent that can be used in order to find parent elements like upper divs which the inicial element is inside of.
.find which will look for especific selectors and/or identificators inside this parent element
.click which will execute the click upon the found element.

```
cy.contains('p', taskName)
  .parent()
  .find('._listItemToggle_1kgm5_16')
  .click()
```

**OBS.:** it's important to note that the element used in here isn't permanent and can change at any momment so we're going to improve it by using the regular expression \* that allow using contains inside the CSS selector. For example:

For the previous location `button[class*=ItemToggle] would allow finding all button elements that have itemToggle description inside the class even if there should be any other elements of text with it. Here the use o parent is really important once it allows looking for the element only inside the defined div.

4. After all that we now validate it the element is checked as done through it's CSS style:

```
._listItemTextSelected_1kgm5_40 {
    text-decoration-line: line-through;
    color: var(--gray-300);
}
```

We'll also add the reset function in order to allow automation once if not we would need to deselect the option before each execution.

1. Changing the const data value:

```
      const task = {
        name: 'Buy ketchup',
        is_done: false
      }
```

2. Updating the new const callout inside each test:

```
      cy.removeTaskByName(task.name)
      cy.postTask(task)

      cy.visit("http://localhost:8080");

      cy.contains("p", task.name)
        .parent()
        .find("button[class*=ItemToggle]")
        .click();

      cy.contains('p', task.name)
      .should('have.css', 'text-decoration-line', 'line-through')
```

### Managing URLs through configuration file

To avoid repetitive information and ease code maintenance it's a BEST PRACTICE to centralize environment urls inside [cypress configuration file](cypress.config.js). Once it is added we then need to change the url callout inside all other files.

Base Url is already a cypress function

```
    baseUrl: "http://localhost:8080",
```

For different cases we can also define a new variable that will store url values, and we can even define an environment as well that could store infinite possible urls

```
    env: {
      apiUrl: 'http://localhost:3333'
    },
```

### Fixtures and hooks

Fixtures allow code organization by storing dynamic steps and/or informative data that do not have direct influence to be the test case but represents or support part of it's execution. Like in [tasks.json](cypress/fixtures/tasks.json)

In here we defined the variable dup which will represent a support variable containing all duplicated task scenario data. Instead of using the name and is_done inside the test case we'll only enter dup as value.

```
{
  "dup": {
    "name": "Study Typescript",
    "is_done": false
  }
}
```

Hooks in the other hand are steps that should be executed before and/or after each test case, allow pre-configuration or analysis of each scenario whithout the need to define all the steps for every test case. Note that we called the fixture file tasks inside our hook.

```
  let testData;

  before(() => {
    cy.fixture("tasks").then((t) => {
      testData = t;
    });
  });
```

**OBS.:** by using hooks it's importance to consider the individuallity and/or independency of each test case, validating if this is really needed or not.

This would allow us to call dup variable with all it's data inside our test case:

```
    it("should not allow duplicated tasks", () => {
      const task = testData.dup
    })
```

**OBS.:** it should return the exact same old response, but now in a more organized and manageable way.

## Viewport

Viewport is used to inform specific resolution for executing the tests, you can use it inside one specific test case by using:

1. `cy.viewport(1920, 1080)` which will change the viewport only during this execution.

2. beforeEach() which will apply viewport to all test case before it's execution.

```
beforeEach(() => {
   cy.viewport(1920, 1080)
   })
```

3. Globally inside [cypress configuration file](cypress.config.js) which will be applied to everything

```
    viewportWidth: 1920,
    viewportHeight: 1080,
```

## CLI and Multi-browser

The final tests, when all is working fine and ready to go, should be executed through CLI because more complex analysis can be done through it considering regression metrics.

**OBS.:** implementation and test development steps should be done through cypress GUI once it would give you feedbacks and alerts for issues and problems during the execution, allowing a better understand and ease to fix and manage those issues.

# Terminal commands

- `yarn init` - initialize node.js
- `yarn add cypress -D` - install cypress as a dev dependency
- `yarn cypress open` - open cypress GUI
- `yarn install` - install all node.js dependencies
- `yarn db:init` - initialize all database structure dependencies
- `yarn dev` - start running the API server
- `yarn cypress run --browser (browser name)` - allow test execution in a specific browser

# Cypress functions

- `.only` - allow to run only the tagged scenario
- `var` - create a variable
- `const` - create one imutable constant
- `context` - allow test cases organization per context inside a test suite

# Important links

- [Faker](https://fakerjs.dev/) - dynamic random data generator
- [Insomnia](https://insomnia.rest/) - API Development Platform
