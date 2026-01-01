# Backend - LLM Article Project

## Description
Node.js + Express backend for the LLM Article Project.
Uses PostgreSQL for database and follows a functional programming approach.

## Running Locally

### Prerequisites
- Node.js (v20+)
- PostgreSQL

### Steps
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` file (copy from example if exists, or set PORT/DB creds).
3. Start development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Deployment
1. Build the project: `npm run build`.
2. Deploy the `dist/` folder and `package.json`.
3. Set environment variables on the host.
4. Run `npm install --production` (or ci).
5. Start with `npm start`.

## Testing
Run unit tests with:
```bash
npm test
```
