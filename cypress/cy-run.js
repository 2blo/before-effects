const cypress = require("cypress");

const args = process.argv.slice(2);
const options = ["cypress", "run", ...args]; // saves passing 'cypress run' on the command line

cypress.cli
  .parseRunArguments(options)
  .then((runOptions) => {
    console.log("runOptions", runOptions);

    cypress
      .run(runOptions)
      .then(() => {
        process.exit(0); // control the exit code
      })
      .catch((error) => {
        console.error(error);
      });
  })
  .catch((error) => {
    console.error(error);
  });
