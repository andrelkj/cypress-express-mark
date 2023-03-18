const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:8080",
    env: {
      apiUrl: 'http://localhost:3333'
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
