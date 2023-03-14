const fs = require("fs");
const convertEnvToCypressEnvFormat = () => {
  const jsonEnv = Object.assign(
    {},
    ...Object.entries(process.env).map((variable) => ({
      [variable[0]]: variable[1],
    }))
  );
  fs.writeFileSync("cypress.env.json", JSON.stringify(jsonEnv));
  console.log("Created temporary cypress.env.json.");
};
convertEnvToCypressEnvFormat();
