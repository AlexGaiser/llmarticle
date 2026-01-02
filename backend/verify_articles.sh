#!/bin/bash
echo "Creating article..."
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Verification Article","content":"This is a test article content for verification."}'
echo -e "\n\nFetching articles..."
curl http://localhost:3000/api/articles
echo -e "\n"
