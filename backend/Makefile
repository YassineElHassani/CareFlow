# CareFlow EHR - Makefile for common tasks
# Usage: make <command>

.PHONY: help setup install dev start worker stop clean logs test lint

# Default target
help:
	@echo "CareFlow EHR - Available Commands"
	@echo "=================================="
	@echo "  make setup      - Initial project setup"
	@echo "  make install    - Install dependencies"
	@echo "  make dev        - Start development environment"
	@echo "  make start      - Start production server"
	@echo "  make worker     - Start email worker"
	@echo "  make stop       - Stop all Docker services"
	@echo "  make restart    - Restart Docker services"
	@echo "  make clean      - Clean containers and volumes"
	@echo "  make logs       - View Docker logs"
	@echo "  make test       - Run tests"
	@echo "  make lint       - Run linter"
	@echo "  make lint-fix   - Fix linting issues"
	@echo ""

# Initial setup
setup:
	@echo "Setting up CareFlow..."
	@if [ ! -f .env ]; then cp .env.example .env; echo "✅ .env created"; fi
	@mkdir -p logs
	@npm install
	@echo "✅ Setup complete!"

# Install dependencies
install:
	@echo "📥 Installing dependencies..."
	@npm install

# Start Docker development environment
dev:
	@echo "🚀 Starting development environment..."
	@docker-compose up

# Start Docker in detached mode
dev-detached:
	@echo "🚀 Starting development environment (detached)..."
	@docker-compose up -d

# Start production
start:
	@echo "🚀 Starting production server..."
	@NODE_ENV=production npm start

# Start email worker
worker:
	@echo "📧 Starting email worker..."
	@npm run worker

# Stop all services
stop:
	@echo "🛑 Stopping all services..."
	@docker-compose down

# Restart services
restart:
	@echo "🔄 Restarting services..."
	@docker-compose restart

# Clean everything
clean:
	@echo "🧹 Cleaning containers, volumes, and node_modules..."
	@docker-compose down -v
	@rm -rf node_modules logs/*.log

# View logs
logs:
	@docker-compose logs -f

# View specific service logs
logs-app:
	@docker-compose logs -f app

logs-worker:
	@docker-compose logs -f worker

logs-mongo:
	@docker-compose logs -f mongo

logs-redis:
	@docker-compose logs -f redis

# Run tests
test:
	@echo "🧪 Running tests..."
	@npm test

# Run linter
lint:
	@echo "🔍 Running linter..."
	@npm run lint

# Fix linting issues
lint-fix:
	@echo "🔧 Fixing linting issues..."
	@npm run lint -- --fix

# Database operations
db-seed:
	@echo "🌱 Seeding database..."
	@node scripts/seed.js

db-reset:
	@echo "⚠️  Resetting database..."
	@docker-compose down -v
	@docker-compose up -d mongo
	@sleep 5
	@echo "✅ Database reset complete"

# Health check
health:
	@echo "🏥 Checking service health..."
	@docker-compose ps

# Show running containers
ps:
	@docker-compose ps

# Shell into containers
shell-app:
	@docker-compose exec app sh

shell-mongo:
	@docker-compose exec mongo mongosh

shell-redis:
	@docker-compose exec redis redis-cli
