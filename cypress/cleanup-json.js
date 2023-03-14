const fs = require("fs");
function removeJson() {
  fs.rmSync("cypress.env.json");
  console.log("Cleaned up cypress.env.json.");
}
removeJson();
