#!/bin/bash
echo "Deploying Healthcare AI Suite Monorepo..."
docker-compose -f infrastructure/docker-compose.yml up --build -d
echo "Deployment successful!"
