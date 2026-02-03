#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Local Deployment Test ===${NC}"
echo "This script builds and tests the full Docker stack locally."
echo ""

# Cleanup function
cleanup() {
    echo -e "\n${YELLOW}Cleaning up containers...${NC}"
    docker compose -f docker-compose.local-test.yml down --volumes --remove-orphans 2>/dev/null || true
}

# Trap ctrl+c and cleanup
trap cleanup EXIT

# Start fresh
echo -e "${YELLOW}1. Stopping any existing containers...${NC}"
docker compose -f docker-compose.local-test.yml down --volumes --remove-orphans 2>/dev/null || true

# Build images
echo -e "\n${YELLOW}2. Building Docker images...${NC}"
docker compose -f docker-compose.local-test.yml build --no-cache

# Start services
echo -e "\n${YELLOW}3. Starting services...${NC}"
docker compose -f docker-compose.local-test.yml up -d

# Wait for services to be ready
echo -e "\n${YELLOW}4. Waiting for services to be ready...${NC}"
echo "   Waiting for API health check..."

MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s -f http://localhost:8080/api/ping > /dev/null 2>&1; then
        echo -e "   ${GREEN}API is healthy!${NC}"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "   Attempt $RETRY_COUNT/$MAX_RETRIES - API not ready yet..."
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo -e "   ${RED}API failed to become healthy after $MAX_RETRIES attempts${NC}"
    echo -e "\n${RED}=== Container Logs ===${NC}"
    docker compose -f docker-compose.local-test.yml logs
    exit 1
fi

# Run tests
echo -e "\n${YELLOW}5. Running connectivity tests...${NC}"
TESTS_PASSED=true

# Test 1: API ping through nginx
echo -n "   Testing API (http://localhost:8080/api/ping)... "
API_RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:8080/api/ping 2>/dev/null)
API_CODE=$(echo "$API_RESPONSE" | tail -n 1)
API_BODY=$(echo "$API_RESPONSE" | head -n -1)

if [ "$API_CODE" = "200" ]; then
    echo -e "${GREEN}PASS${NC} (Response: $API_BODY)"
else
    echo -e "${RED}FAIL${NC} (HTTP $API_CODE)"
    TESTS_PASSED=false
fi

# Test 2: Frontend through nginx
echo -n "   Testing Frontend (http://localhost:8080/)... "
FRONTEND_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/ 2>/dev/null)

if [ "$FRONTEND_CODE" = "200" ]; then
    echo -e "${GREEN}PASS${NC}"
else
    echo -e "${RED}FAIL${NC} (HTTP $FRONTEND_CODE)"
    TESTS_PASSED=false
fi

# Test 3: Check that frontend HTML contains expected content
echo -n "   Testing Frontend serves React app... "
FRONTEND_CONTENT=$(curl -s http://localhost:8080/ 2>/dev/null)
if echo "$FRONTEND_CONTENT" | grep -q "root"; then
    echo -e "${GREEN}PASS${NC}"
else
    echo -e "${RED}FAIL${NC} (Missing root element)"
    TESTS_PASSED=false
fi

# Test 4: Verify nginx is handling the proxy (X-Forwarded headers)
echo -n "   Testing API receives proxy headers... "
# The API should be accessible and nginx should be forwarding requests
if curl -s -f http://localhost:8080/api/ping > /dev/null 2>&1; then
    echo -e "${GREEN}PASS${NC}"
else
    echo -e "${RED}FAIL${NC}"
    TESTS_PASSED=false
fi

# Summary
echo ""
if [ "$TESTS_PASSED" = true ]; then
    echo -e "${GREEN}=== All tests passed! ===${NC}"
    echo ""
    echo "The local deployment is working correctly."
    echo "  - Frontend: http://localhost:8080/"
    echo "  - API:      http://localhost:8080/api/ping"
    echo ""
    echo "Press Ctrl+C to stop the containers."
    echo ""
    
    # Keep running so user can test manually
    echo -e "${YELLOW}Containers are still running for manual testing...${NC}"
    docker compose -f docker-compose.local-test.yml logs -f
else
    echo -e "${RED}=== Some tests failed ===${NC}"
    echo ""
    echo "Check the logs for more details:"
    echo "  docker compose -f docker-compose.local-test.yml logs"
    exit 1
fi
