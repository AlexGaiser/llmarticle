import dotenv from 'dotenv';
import path from 'path';
import jwt from 'jsonwebtoken';

// Load .env from the root of backend
dotenv.config({ path: path.join(__dirname, '../.env') });

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  console.error('Error: JWT_SECRET not found in .env');
  process.exit(1);
}

const userIdOrUsername = process.argv[2];

if (!userIdOrUsername) {
  console.error('Usage: npx ts-node -r tsconfig-paths/register scripts/generate-token.ts <userId>');
  process.exit(1);
}

// In this app, the JWT payload expects { userId: string }
// If we want to support usernames, we'd need to look up the user first,
// but for a quick tool, assuming the input is the userId is safer.
// However, the user might want to just pass their username.

const token = jwt.sign({ userId: userIdOrUsername }, JWT_SECRET, {
  expiresIn: JWT_EXPIRES_IN as any,
});

console.log('\nGenerated JWT Token:');
console.log('-------------------');
console.log(token);
console.log('-------------------\n');
console.log('Example curl:');
console.log(`curl -H "Authorization: Bearer ${token}" http://localhost:3000/v1/articles\n`);
