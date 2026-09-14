# Wayfarinook API

This repository contains the TypeScript and Express service shell for the Wayfarinook travel API.

## Run locally

Use Node.js 20 or newer and npm. `package.json` is the dependency manifest: it lists the libraries and commands required by the project.

```sh
npm install
npm run dev
```

The service listens on port `3000` by default. Set the `PORT` environment variable to use another port e.g 5000.

For a production-style run, compile the TypeScript source and start the generated JavaScript:

```sh
npm run build
npm start
```
