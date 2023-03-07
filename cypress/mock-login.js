const { PrismaClient } = require("@prisma/client");

async function f() {
  const prisma = new PrismaClient();
  await prisma.user.create({ data: { id: process.env.USER_CUID } });
  await prisma.session.create({
    data: {
      id: process.env.SESSION_CUID,
      sessionToken: process.env.SESSION_TOKEN,
      expires: process.env.SESSION_EXPIRES,
      userId: process.env.USER_CUID,
    },
  });
  console.log("Prisma user and session created.");
}

f();
