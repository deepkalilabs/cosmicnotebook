# Remove all build cache
docker builder prune -f

# Remove dangling images (untagged)
docker image prune -f

# Remove all unused containers
docker container prune -f

# Remove all unused networks
docker network prune -f

# Most comprehensive cleanup - removes:
# - all stopped containers
# - all networks not used by at least one container
# - all dangling images
# - all dangling build cache
docker system prune -f

# Even more aggressive - also removes:
# - all unused images (not just dangling)
# - build cache
docker system prune -a -f

# Most aggressive - adds volume cleanup:
docker system prune -a --volumes -f
