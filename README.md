<h1>Before Effects</h1>

# Usage

## Local Dev

Clean:

```bash
rm -rf node_modules
npm ci
```

```bash
npm install
npm run build
```

Update client schema:

```bash
npx prisma generate
```

Prototype with

```bash
npx prisma db push
```

Commit / create initial tables:

```bash
npx prisma migrate dev
```

```bash
npm run dev
```

## Inspect db

Print a table, with 1 optional `WHERE` selection:

```bash
python .scripts/inspect-db.py <TableName> <column=value>
```

Use the `Excel Viewer` extension to view.

## Vercel

Add [build command](https://vercel.com/2blo/before-effects/settings) from [custom npm script](https://github.com/2blo/before-effects/blob/3-document-usage/package.json) according to [Prisma docs](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel#1-create-and-deploy-the-project-with-the-vercel-deploy-button):

```bash
npm run vercel-build
```

Warning: Preview deployments have "random" URLs that wont be listed in [Google Cloud credentials](https://console.cloud.google.com/apis/credentials/oauthclient/).

# Enviroments

## Databases

- `production`
- `dev`
- `shadow`

## Branches

- `main`
- `feature/x`

## Vercel Deployments / Env Vars:

- `production` (branch: main)
- `preview` (branch: feature->main)
- `dev` - just used for [storing env vars that you can download, they are not used in deployment.](https://vercel.com/docs/concepts/projects/environment-variables#development-environment-variables)

## Local Deployments / Env Vars:

- `dev` (db: dev)
- `npx prisma migrate` (db: dev + shadow)

## Auth:

- `Google` for Main `before-effects.vercel.app` and local dev `localhost:3000`.
- `Email` for preview.

Each feature branch will get a new url, you have to set it manually in Google console, and update the Vercel settings.

# Create T3 App

This is an app bootstrapped according to the [init.tips](https://init.tips) stack, also known as the T3-Stack.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with the most basic configuration and then move on to more advanced configuration.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next-Auth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [TailwindCSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

We also [roll our own docs](https://create.t3.gg) with some summary information and links to the respective documentation.

Also checkout these awesome tutorials on `create-t3-app`.

- [Build a Blog With the T3 Stack - tRPC, TypeScript, Next.js, Prisma & Zod](https://www.youtube.com/watch?v=syEWlxVFUrY)
- [Build a Live Chat Application with the T3 Stack - TypeScript, Tailwind, tRPC](https://www.youtube.com/watch?v=dXRRY37MPuk)
- [Build a full stack app with create-t3-app](https://www.nexxel.dev/blog/ct3a-guestbook)
- [A first look at create-t3-app](https://dev.to/ajcwebdev/a-first-look-at-create-t3-app-1i8f)

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
