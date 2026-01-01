# Project Setup

## Description
This is a project file to create a website that can host and display articles written by a user. The user should be able to write articles on the website or upload markdown files directly. The articles should be stored on a backend server and displayed on the website.

## Tech Stack

### Frontend Stack Requirements
- Typescript
- React
- Tailwind CSS

### Backend Stack Requirements
- Node.js
- Express
- PostgreSQL

## Project Structure
Create separate folders for frontend and backend.

## Running Locally
The frontend and backend should be able to run locally.
There should be a README file in each folder with instructions on how to run the frontend and backend locally.
Frontend and and should be able to be run separately
Frontend should be able to run against the deployed backend

## Deployment
Both the frontend and the backend should be able to be deployed to a server, agnostic of host provider.
The current expectation is that the backend will be hosted on digital ocean and the frontend will be hosted on AWS S3.
There should be a README file in each folder with instructions on how to deploy the frontend and backend.

## Requirements

- The website should be able to host and display articles written by a user.
- The website should be simple and easy to use.
- The website should be responsive and mobile-friendly.
- The website should use a simple, modern, and clean design.
- The user should be able to write articles on the website or upload markdown files directly.
- A user should be able to create, read, update, and delete articles
- The articles should be stored on a backend server and displayed on the website.
- The website should be able to run locally and be deployed to a server, agnostic of host provider.
- The backend should be able to run locally and be deployed to a server, agnostic of host provider.
- The frontend should be able to run locally and be deployed to a server, agnostic of host provider.
- The backend should be able to run locally and be deployed to a server, agnostic of host provider.
- The backend should only allow authenticated users to create, update, and delete articles.
- There should be thorough unit tests for the backend.
- There should be thorough unit tests for the frontend.


## Authentication
The authentication should be handled by the backend.
It should use JWT tokens for authentication

## Open Questions (These can be answered by the LLM)
- What library should be used for database access?
- What library should be used for authentication?
- What library should be used for markdown processing or should we create our own?
- What library should be used for file upload and storage?

## Agent Reference
For behavioral rules and coding standards, refer to `.agent/AGENT_INSTRUCTIONS.md`.
