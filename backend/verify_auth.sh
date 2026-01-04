#!/bin/bash
# TODO: Replace this shell script with real integration tests using Supertest/Jest.
COOKIE_FILE="cookies.txt"
rm -f $COOKIE_FILE

echo "=== Testing Auth Endpoints (Cookie-based) ==="

echo -e "\n1. Register a new user..."
REGISTER_RESPONSE=$(curl -s -i -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -c $COOKIE_FILE \
  -d "{\"email\":\"test_$(date +%s)@example.com\",\"password\":\"password123\"}")
echo "$REGISTER_RESPONSE"

echo -e "\n2. Get current user (protected route)..."
curl -s -b $COOKIE_FILE http://localhost:3000/api/auth/me

echo -e "\n\n3. Create article without cookie (should fail)..."
curl -s -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"Unauth Article","content":"Should fail"}'

echo -e "\n\n4. Create article with cookie (should succeed)..."
curl -s -b $COOKIE_FILE -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"Auth Article","content":"Should succeed"}'

echo -e "\n\n5. Logout..."
curl -s -i -X POST http://localhost:3000/api/auth/logout -b $COOKIE_FILE -c $COOKIE_FILE
echo -e "\n"

echo -e "6. Get current user after logout (should fail)..."
curl -s -b $COOKIE_FILE http://localhost:3000/api/auth/me

echo -e "\n\n=== Tests Complete ==="
rm -f $COOKIE_FILE
