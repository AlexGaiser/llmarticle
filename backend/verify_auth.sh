#!/bin/bash
echo "=== Testing Auth Endpoints ==="

echo -e "\n1. Register a new user..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')
echo "$REGISTER_RESPONSE"

TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo -e "\nExtracted token: ${TOKEN:0:20}..."

echo -e "\n2. Login with the same user..."
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

echo -e "\n\n3. Get current user (protected route)..."
curl -s http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n\n4. Create article without token (should fail)..."
curl -s -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"Unauth Article","content":"Should fail"}'

echo -e "\n\n5. Create article with token (should succeed)..."
curl -s -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Auth Article","content":"Should succeed"}'

echo -e "\n\n=== Tests Complete ==="
