# Server Makefile for choreoatlas.io

将这个 Makefile 放在服务器上用于自动更新文档站。

```makefile
# Makefile for choreoatlas.io docs site update
# Place this file on your server as 'Makefile'

# Variables
DOCKER_IMAGE := ghcr.io/choreoatlas2025/docs:latest
CONTAINER_NAME := choreoatlas-docs
PORT := 80
DOCS_PATH := /docs

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

.PHONY: help update pull stop start restart status logs clean backup

# Default target
help:
	@echo "$(GREEN)ChoreoAtlas Docs Site Management$(NC)"
	@echo ""
	@echo "Available commands:"
	@echo "  $(YELLOW)make update$(NC)    - Full update: pull latest image and restart container"
	@echo "  $(YELLOW)make pull$(NC)      - Pull latest Docker image only"
	@echo "  $(YELLOW)make restart$(NC)   - Restart the container with new image"
	@echo "  $(YELLOW)make status$(NC)    - Show container status"
	@echo "  $(YELLOW)make logs$(NC)      - Show container logs (last 50 lines)"
	@echo "  $(YELLOW)make backup$(NC)    - Backup current container before update"
	@echo "  $(YELLOW)make clean$(NC)     - Remove old images and containers"

# Main update command - this is what you'll use most
update: backup pull restart clean status
	@echo "$(GREEN)✅ Update complete!$(NC)"
	@echo "$(GREEN)Documentation site is now running the latest version$(NC)"
	@echo "Visit: https://choreoatlas.io"

# Pull the latest Docker image
pull:
	@echo "$(YELLOW)📦 Pulling latest Docker image...$(NC)"
	docker pull $(DOCKER_IMAGE)
	@echo "$(GREEN)✅ Image pulled successfully$(NC)"

# Stop the running container
stop:
	@echo "$(YELLOW)⏹️  Stopping container...$(NC)"
	-docker stop $(CONTAINER_NAME) 2>/dev/null || true
	@echo "$(GREEN)✅ Container stopped$(NC)"

# Remove the old container
remove:
	@echo "$(YELLOW)🗑️  Removing old container...$(NC)"
	-docker rm $(CONTAINER_NAME) 2>/dev/null || true
	@echo "$(GREEN)✅ Old container removed$(NC)"

# Start new container with latest image
start: stop remove
	@echo "$(YELLOW)🚀 Starting new container...$(NC)"
	docker run -d \
		--name $(CONTAINER_NAME) \
		--restart=unless-stopped \
		-p $(PORT):80 \
		-e BASE_URL=/docs \
		$(DOCKER_IMAGE)
	@echo "$(GREEN)✅ Container started$(NC)"

# Restart with new image
restart: stop remove start
	@echo "$(GREEN)✅ Container restarted with latest image$(NC)"

# Show container status
status:
	@echo "$(YELLOW)📊 Container Status:$(NC)"
	@docker ps -a | grep $(CONTAINER_NAME) || echo "Container not found"
	@echo ""
	@echo "$(YELLOW)🏷️  Image Info:$(NC)"
	@docker images | grep choreoatlas2025/docs | head -1 || echo "Image not found"

# Show logs
logs:
	@echo "$(YELLOW)📜 Container Logs (last 50 lines):$(NC)"
	docker logs --tail 50 $(CONTAINER_NAME)

# Backup current container (creates a tag with timestamp)
backup:
	@echo "$(YELLOW)💾 Creating backup...$(NC)"
	-docker tag $(DOCKER_IMAGE) $(DOCKER_IMAGE:latest=backup-$(shell date +%Y%m%d-%H%M%S)) 2>/dev/null || true
	@echo "$(GREEN)✅ Backup created$(NC)"

# Clean up old images and stopped containers
clean:
	@echo "$(YELLOW)🧹 Cleaning up old resources...$(NC)"
	-docker image prune -f
	-docker container prune -f
	@echo "$(GREEN)✅ Cleanup complete$(NC)"

# Health check
health:
	@echo "$(YELLOW)🏥 Checking health...$(NC)"
	@curl -f http://localhost$(DOCS_PATH) > /dev/null 2>&1 && \
		echo "$(GREEN)✅ Site is healthy$(NC)" || \
		echo "$(RED)❌ Site is not responding$(NC)"

# Quick update without backup (use with caution)
quick-update: pull restart status
	@echo "$(GREEN)✅ Quick update complete!$(NC)"

# Rollback to backup (specify BACKUP_TAG)
rollback:
	@if [ -z "$(BACKUP_TAG)" ]; then \
		echo "$(RED)❌ Please specify BACKUP_TAG, e.g., make rollback BACKUP_TAG=backup-20250927-120000$(NC)"; \
		exit 1; \
	fi
	@echo "$(YELLOW)⏪ Rolling back to $(BACKUP_TAG)...$(NC)"
	docker tag $(DOCKER_IMAGE:latest=$(BACKUP_TAG)) $(DOCKER_IMAGE)
	$(MAKE) restart
	@echo "$(GREEN)✅ Rollback complete$(NC)"

# Show available backups
list-backups:
	@echo "$(YELLOW)📋 Available backups:$(NC)"
	@docker images | grep "choreoatlas2025/docs.*backup" | awk '{print $$2, $$3, $$4, $$5}'
```

## Usage Instructions

### 1. Save this Makefile on your server:
```bash
# SSH into your server
ssh your-server

# Create the Makefile
nano Makefile
# Paste the content above

# Make it executable
chmod +x Makefile
```

### 2. Primary usage:
```bash
# Full update (recommended)
make update

# Just check status
make status

# View logs if something goes wrong
make logs

# Emergency rollback
make list-backups
make rollback BACKUP_TAG=backup-20250927-120000
```

### 3. Automated updates with cron:
```bash
# Add to crontab for daily updates at 3 AM
crontab -e
# Add this line:
0 3 * * * cd /path/to/docs && make update >> /var/log/choreoatlas-update.log 2>&1
```

### 4. GitHub Actions webhook (optional):
You can also trigger updates via webhook when GitHub Actions completes the build:
```bash
# Create a simple webhook receiver
cat > /usr/local/bin/update-docs.sh << 'EOF'
#!/bin/bash
cd /path/to/docs
make update
EOF
chmod +x /usr/local/bin/update-docs.sh
```

## Notes:
- The image `ghcr.io/choreoatlas2025/docs:latest` should be automatically built and pushed by GitHub Actions
- Make sure Docker is installed on the server
- Ensure port 80 is available or adjust the PORT variable
- The container runs with `--restart=unless-stopped` for automatic recovery