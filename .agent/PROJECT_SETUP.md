# Project Initialization Workflow

This document outlines the specific steps to initialize the `llmarticle` project.

## Phase 1: Repository & Environment
- [ ] **Initialize Git**: Ensure git is initialized and `.gitignore` is configured for Node/Mac/VSCode.
- [ ] **Folder Structure**: Create `/frontend` and `/backend` directories.

## Phase 2: Backend Setup
- [ ] **Initialize Node**: Run `npm init` in `/backend`.
- [ ] **Dependencies**: Install `express`, `pg` (PostgreSQL client), `dotenv`.
- [ ] **Dev Dependencies**: Install `typescript`, `ts-node`, `nodemon`, `@types/node`, `@types/express`, `eslint`, `prettier`.
- [ ] **Configuration**: Create `tsconfig.json` (strict mode), `.eslintrc.js`, `.prettierrc`.
- [ ] **Hello World**: Create a basic `src/server.ts` that listens on port 3000 and responds to `/health`.

## Phase 3: Frontend Setup
- [ ] **Initialize Vite**: Run `npm create vite@latest frontend -- --template react-ts`.
- [ ] **Tailwind**: Install and configure Tailwind CSS.
- [ ] **Cleanup**: Remove default Vite boilerplate (logos, counter example).
- [ ] **Dependencies**: Install `axios` (or `fetch` usage plan).

## Phase 4: Verification
- [ ] **Run Locally**: Ensure both frontend and backend can start simultaneously (consider `concurrently` in root or separate terminals).
- [ ] **Commit**: Push the initial setup with message `chore: project initialization`.