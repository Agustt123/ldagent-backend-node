.PHONY: dev start docker-build up down logs

dev:
	npm run dev

start:
	npm run start

docker-build:
	docker build -t ldagent-backend:latest .

up:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f
