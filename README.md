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

Because of it we're not gonna be using faker in here. Instead we'll use fixed data trying a new approach to solve repetitive information issue by deleting data through API.

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

### Xpath

Cypress do not support xpath selectors, although it has it's own functions to identify elements. For example:

Considering the xpath `//button[contains(text(), "Create")]` to identify the Create button we would use cypress function:

```
cy.contains('button', 'Create').click()
```

This would not only find the locator but also execute the click function on it.

# Terminal commands

- `yarn init` - initialize node.js
- `yarn add cypress -D` - install cypress as a dev dependency
- `yarn cypress open` - open cypress GUI
- `yarn install` - install all node.js dependencies
- `yarn db:init` - initialize all database structure dependencies
- `yarn dev` - start running the API server

# Important links

- [Faker](https://fakerjs.dev/) - dynamic random data generator
- [Insomnia](https://insomnia.rest/) - API Development Platform