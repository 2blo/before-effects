describe("Edit page", () => {
  it("Should not be allowed to be visited without a post attached.", () => {
    cy.visit("/edit");
    cy.url().should("equal", "http://localhost:3000/");
  });
});

export {};
