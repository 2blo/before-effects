describe("User page", () => {
  it('should have a sign out button, but not a "go to profile"-button ', () => {
    cy.visit("/");
    cy.login();
    cy.visit(`/user/${Cypress.env("USER_CUID")}`);
    cy.get('[alt="Log in or manage profile."]').click();
    cy.get("button").contains("Sign out");
    cy.get("button").contains("Your Portfolio").should("not.exist");
  });
});

export {};
