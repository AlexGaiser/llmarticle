import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file for testing
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Set default values if not present for tests
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-secret';
}

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}
