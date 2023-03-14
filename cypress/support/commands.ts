Cypress.Commands.add("login", login);
function login() {
  cy.session([], () => {
    cy.intercept("/api/auth/session", {
      user: {
        name: "Spongebob Squarepants",
        email: "spongebob@bikinibottom.com",
        image: "/path/to/mock/user.jpg",
        id: Cypress.env("USER_CUID"),
      },
      expires: Cypress.env("SESSION_EXPIRES"),
      id: Cypress.env("SESSION_CUID"),
      userId: Cypress.env("USER_CUID"),
      sessionToken: Cypress.env("SESSION_TOKEN"),
    }).as("session");

    // Set the cookie for cypress.
    // It has to be a valid cookie so next-auth can decrypt it and confirm its validity.
    // This cookie also may need to be refreshed intermittently if it expires
    cy.setCookie(Cypress.env("COOKIE_NAME"), Cypress.env("SESSION_TOKEN"));
  });
}
export {};
