# Air Astana Virtual Site

A web frontend for Air Astana Virtual, an Infinite Flight virtual airline community. Built with a Vite, React and TypeScript toolchain.

## Requirements
- Node.js 18 or newer
- npm

## Run locally
```bash
git clone https://github.com/Gurnoor1-dev/air-astana-virtual-site.git
cd air-astana-virtual-site
npm install
npm run dev
```

Open the local URL printed by Vite. If the project uses external services, configure the required variables in a local `.env` file. Never commit real secrets.

## Build and preview
```bash
npm run build
npm run preview
```

## Deploy from a terminal
```bash
npm install -g vercel
vercel
vercel --prod
```

## Deploy on Vercel
1. Import the repository into Vercel.
2. Choose Vite as the framework preset.
3. Use `npm install` and `npm run build`; output directory is normally `dist`.
4. Add required environment variables through Vercel Project Settings.
5. Deploy a preview and verify navigation and responsive layouts before production.

## Security
Do not commit tokens or private configuration. Keep server-side credentials on the server, never in browser-exposed variables.