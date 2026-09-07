#!/bin/bash

set -e

echo "===== TASK 10 DEPLOYMENT START ====="

echo "Pulling latest Docker images..."
docker pull sandeep00t/task10-backend:latest
docker pull sandeep00t/task10-frontend:latest

echo "Stopping existing containers..."
docker rm -f task10-frontend task10-backend 2>/dev/null || true

echo "Ensuring Docker network exists..."
docker network inspect task10-network >/dev/null 2>&1 || \
docker network create task10-network

echo "Starting backend..."

docker run -d \
  --name task10-backend \
  --network task10-network \
  --network-alias backend \
  -p 5000:5000 \
  --env-file ~/task10-cicd/backend.env \
  sandeep00t/task10-backend:latest

echo "Starting frontend..."

docker run -d \
  --name task10-frontend \
  --network task10-network \
  -p 80:80 \
  sandeep00t/task10-frontend:latest

echo "Waiting for services..."
sleep 5

echo "===== CONTAINER STATUS ====="

docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"

echo "===== BACKEND HEALTH ====="

curl -f http://localhost:5000/health

echo

echo "===== APPLICATION API ====="

curl -f http://localhost/api/tasks

echo

echo "===== TASK 10 DEPLOYMENT SUCCESS ====="
