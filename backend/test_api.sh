#!/bin/bash

# API Testing Script for E-commerce Backend
# This script tests all API endpoints with real examples

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE_URL="http://localhost:8000/api/v1"
ADMIN_EMAIL="admin@ecommerce.com"
ADMIN_PASSWORD="admin123"
# Use timestamp to create unique test users
TIMESTAMP=$(date +%s)
TEST_USER_EMAIL="testuser${TIMESTAMP}@example.com"
TEST_USER_USERNAME="testuser${TIMESTAMP}"
TEST_USER_PASSWORD="testpass123"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to check if server is running
check_server() {
    print_status "Checking if backend server is running..."
    if curl -s "$API_BASE_URL/products/" > /dev/null 2>&1; then
        print_success "Backend server is running"
    else
        print_error "Backend server is not running. Please start it with: docker-compose up"
        exit 1
    fi
}

# Function to test products endpoint
test_products() {
    print_status "Testing products endpoint..."
    
    # Test GET /products
    response=$(curl -s "$API_BASE_URL/products/")
    if echo "$response" | grep -q '"success":true'; then
        print_success "GET /products - OK"
        echo "Response: $(echo "$response" | jq '.count // "N/A"') products found"
    else
        print_error "GET /products - FAILED"
        echo "Response: $response"
    fi
}

# Function to test user registration
test_user_registration() {
    print_status "Testing user registration..."
    
    response=$(curl -s -X POST "$API_BASE_URL/users/create/" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$TEST_USER_EMAIL\",
            \"username\": \"$TEST_USER_USERNAME\",
            \"nom\": \"Test User\",
            \"password\": \"$TEST_USER_PASSWORD\",
            \"password_confirm\": \"$TEST_USER_PASSWORD\"
        }")
    
    if echo "$response" | grep -q '"success":true'; then
        print_success "User registration - OK"
    else
        print_warning "User registration - User might already exist"
        echo "Response: $response"
    fi
}

# Function to test user login
test_user_login() {
    print_status "Testing user login..."
    
    response=$(curl -s -X POST "$API_BASE_URL/auth/login/" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$TEST_USER_EMAIL\",
            \"password\": \"$TEST_USER_PASSWORD\"
        }")
    
    if echo "$response" | grep -q '"success":true'; then
        print_success "User login - OK"
        # Extract access token for further tests
        ACCESS_TOKEN=$(echo "$response" | jq -r '.data.tokens.access')
        echo "Access token extracted for further tests"
    else
        print_error "User login - FAILED"
        echo "Response: $response"
        return 1
    fi
}

# Function to test admin login
test_admin_login() {
    print_status "Testing admin login..."
    
    response=$(curl -s -X POST "$API_BASE_URL/auth/login/" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$ADMIN_EMAIL\",
            \"password\": \"$ADMIN_PASSWORD\"
        }")
    
    if echo "$response" | grep -q '"success":true'; then
        print_success "Admin login - OK"
        # Extract admin access token
        ADMIN_ACCESS_TOKEN=$(echo "$response" | jq -r '.data.tokens.access')
        echo "Admin access token extracted for product creation tests"
    else
        print_error "Admin login - FAILED"
        echo "Response: $response"
        return 1
    fi
}

# Function to test user profile
test_user_profile() {
    if [ -z "$ACCESS_TOKEN" ]; then
        print_warning "Skipping user profile test - no access token"
        return
    fi
    
    print_status "Testing user profile..."
    
    response=$(curl -s -X GET "$API_BASE_URL/auth/profile/" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    if echo "$response" | grep -q '"success":true'; then
        print_success "User profile - OK"
    else
        print_error "User profile - FAILED"
        echo "Response: $response"
    fi
}

# Function to test product creation
test_product_creation() {
    if [ -z "$ADMIN_ACCESS_TOKEN" ]; then
        print_warning "Skipping product creation test - no admin access token"
        return
    fi
    
    print_status "Testing product creation..."
    
    response=$(curl -s -X POST "$API_BASE_URL/products/create/" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN" \
        -d "{
            \"nom\": \"API Test Product\",
            \"description\": \"Product created via API testing script\",
            \"prix\": 99.99,
            \"quantite\": 10
        }")
    
    if echo "$response" | grep -q '"success":true'; then
        print_success "Product creation - OK"
        PRODUCT_ID=$(echo "$response" | jq -r '.data.id')
        echo "Created product with ID: $PRODUCT_ID"
    else
        print_error "Product creation - FAILED"
        echo "Response: $response"
    fi
}

# Function to test product update
test_product_update() {
    if [ -z "$ADMIN_ACCESS_TOKEN" ] || [ -z "$PRODUCT_ID" ]; then
        print_warning "Skipping product update test - no admin token or product ID"
        return
    fi
    
    print_status "Testing product update..."
    
    response=$(curl -s -X PUT "$API_BASE_URL/products/$PRODUCT_ID/" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN" \
        -d "{
            \"nom\": \"Updated API Test Product\",
            \"description\": \"Updated description via API testing\",
            \"prix\": 149.99,
            \"quantite\": 15
        }")
    
    if echo "$response" | grep -q '"success":true'; then
        print_success "Product update - OK"
    else
        print_error "Product update - FAILED"
        echo "Response: $response"
    fi
}

# Function to test product deletion
test_product_deletion() {
    if [ -z "$ADMIN_ACCESS_TOKEN" ] || [ -z "$PRODUCT_ID" ]; then
        print_warning "Skipping product deletion test - no admin token or product ID"
        return
    fi
    
    print_status "Testing product deletion..."
    
    response=$(curl -s -X DELETE "$API_BASE_URL/products/$PRODUCT_ID/" \
        -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN")
    
    if [ "$response" = "" ] || echo "$response" | grep -q '"success":true'; then
        print_success "Product deletion - OK"
    else
        print_error "Product deletion - FAILED"
        echo "Response: $response"
    fi
}

# Function to test error handling
test_error_handling() {
    print_status "Testing error handling..."
    
    # Test invalid login
    response=$(curl -s -X POST "$API_BASE_URL/auth/login/" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"invalid@email.com\",
            \"password\": \"wrongpassword\"
        }")
    
    if echo "$response" | grep -q '"success":false'; then
        print_success "Invalid login error handling - OK"
    else
        print_error "Invalid login error handling - FAILED"
    fi
    
    # Test unauthorized access
    response=$(curl -s -X GET "$API_BASE_URL/users/" \
        -H "Authorization: Bearer invalid_token")
    
    if echo "$response" | grep -q "not valid"; then
        print_success "Unauthorized access error handling - OK"
    else
        print_error "Unauthorized access error handling - FAILED"
    fi
}

# Function to run performance test
test_performance() {
    print_status "Running performance test..."
    
    start_time=$(date +%s.%N)
    
    # Make 10 concurrent requests
    for i in {1..10}; do
        curl -s "$API_BASE_URL/products/" > /dev/null &
    done
    wait
    
    end_time=$(date +%s.%N)
    duration=$(echo "$end_time - $start_time" | bc)
    
    print_success "Performance test completed in ${duration}s"
}

# Main execution
main() {
    echo "=========================================="
    echo "E-commerce API Testing Script"
    echo "=========================================="
    echo
    
    # Check if jq is installed
    if ! command -v jq &> /dev/null; then
        print_error "jq is required but not installed. Please install jq first."
        print_status "On macOS: brew install jq"
        print_status "On Ubuntu: sudo apt-get install jq"
        exit 1
    fi
    
    # Check if bc is installed
    if ! command -v bc &> /dev/null; then
        print_error "bc is required but not installed. Please install bc first."
        print_status "On macOS: brew install bc"
        print_status "On Ubuntu: sudo apt-get install bc"
        exit 1
    fi
    
    # Run tests
    check_server
    echo
    
    test_products
    echo
    
    test_user_registration
    echo
    
    test_user_login
    echo
    
    test_admin_login
    echo
    
    test_user_profile
    echo
    
    test_product_creation
    echo
    
    test_product_update
    echo
    
    test_product_deletion
    echo
    
    test_error_handling
    echo
    
    test_performance
    echo
    
    echo "=========================================="
    print_success "All tests completed!"
    echo "=========================================="
}

# Run main function
main "$@"
