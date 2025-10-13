#!/bin/bash

# CareFlow EHR - Quick Setup Script
# This script helps you set up the project quickly

set -e

echo "🏥 CareFlow EHR - Setup Script"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
  echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
  cp .env.example .env
  echo -e "${GREEN}✅ .env file created. Please update it with your configuration.${NC}"
  echo ""
else
  echo -e "${GREEN}✅ .env file already exists.${NC}"
  echo ""
fi

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo -e "${RED}❌ Node.js version 18+ is required. You have $(node -v)${NC}"
  exit 1
else
  echo -e "${GREEN}✅ Node.js $(node -v) detected.${NC}"
  echo ""
fi

# Check Docker
echo "🐳 Checking Docker..."
if command -v docker &> /dev/null; then
  echo -e "${GREEN}✅ Docker $(docker --version | cut -d' ' -f3 | cut -d',' -f1) detected.${NC}"
else
  echo -e "${YELLOW}⚠️  Docker not found. Install Docker to use docker-compose.${NC}"
fi
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
npm install
echo -e "${GREEN}✅ Dependencies installed.${NC}"
echo ""

# Create logs directory
mkdir -p logs
echo -e "${GREEN}✅ Logs directory created.${NC}"
echo ""

echo "================================"
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Update your .env file with proper configuration"
echo "2. Run 'docker-compose up' to start all services"
echo "3. Or run 'npm run dev' for local development"
echo ""
echo "Useful commands:"
echo "  - docker-compose up -d    # Start in background"
echo "  - docker-compose logs -f  # View logs"
echo "  - docker-compose down     # Stop services"
echo "  - npm test                # Run tests"
echo ""
echo "API will be available at: http://localhost:3000"
echo "MailDev UI at: http://localhost:1080"
echo ""
