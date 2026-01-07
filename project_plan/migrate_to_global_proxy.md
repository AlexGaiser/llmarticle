# Migration Plan: Centralized Global Reverse Proxy

This document outlines the steps to migrate from a "project-centric" Nginx setup (where each project handles its own SSL and ports 80/443) to a "Global Reverse Proxy" architecture. This allows $N$ independent projects to coexist on a single droplet.

## Architectural Overview

### Current (Project-Centric)

- `llmarticle-web` container binds to host ports `80` and `443`.
- SSL certificates are managed inside the project.
- Only one project can run at a time on these ports.

### Target (Global Proxy)

- **Global Proxy**: A single container (e.g., Nginx Proxy Manager or Traefik) binds to host ports `80` and `443`.
- **Internal Network**: All projects connect to a shared Docker network (e.g., `proxy-network`).
- **Project Services**: Project-specific Nginx/API containers do **not** bind to host ports 80/443. They are accessed only via the internal network.
- **Routing**: The Global Proxy inspects the `Host` header and routes to the correct internal service.

---

## Step-by-Step Implementation

### 1. Infrastructure Preparation

Create a shared Docker network that all applications (current and future) will join.

```bash
docker network create proxy-gateway
```

### 2. Deploy Global Reverse Proxy (GRP)

Deploy **Nginx Proxy Manager (NPM)** as the centralized "Front Door."

**File: `/var/www/global-proxy/docker-compose.yml`**

```yaml
version: "3.8"
services:
  app:
    image: "jc21/nginx-proxy-manager:latest"
    ports:
      - "80:80"
      - "81:81" # Admin UI
      - "443:443"
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
    networks:
      - proxy-gateway

networks:
  proxy-gateway:
    external: true
```

### 3. Refactor Existing Project (`llmarticle`)

Modify the project to remove host port collisions and join the gateway.

#### A. Update `docker-compose.prod.yml`

- Remove port mappings `80:80` and `443:443`.
- Add the external `proxy-gateway` network.

```yaml
services:
  web:
    # ...
    # REMOVE: ports: ["80:80", "443:443"]
    networks:
      - app-network
      - proxy-gateway
# ...
networks:
  proxy-gateway:
    external: true
```

#### B. Update Nginx Config (Internal)

The project's internal Nginx should now only listen on port 80 (since SSL is handled by the GRP).

**File: `frontend/nginx.conf`**

```nginx
server {
    listen 80;
    server_name llmarticle.alexgaiser.com api.llmarticle.alexgaiser.com;

    # Internal routing logic
    location / {
        proxy_pass http://api:3000/v1/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. Configure Routing in GRP

Access the GRP Admin UI (Port 81) and create "Proxy Hosts":

| Domain                          | Forward IP/Hostname  | Port | SSL                 |
| ------------------------------- | -------------------- | ---- | ------------------- |
| `llmarticle.alexgaiser.com`     | `llmarticle-web`     | 80   | Let's Encrypt (NPM) |
| `api.llmarticle.alexgaiser.com` | `llmarticle-web`     | 80   | Let's Encrypt (NPM) |
| `future-project.com`            | `future-project-web` | 80   | Let's Encrypt (NPM) |

---

## Security & Maintenance

1. **Centralized SSL**: Let's Encrypt certificates are now managed in one place. You no longer need `certbot` volumes in individual projects.
2. **Isolation**: Projects only communicate with the proxy via the `proxy-gateway` network.
3. **No Downtime**: New projects can be added by simply spinning up their containers and adding a record in the GRP UI, without touching other running apps.
4. **Trust Proxy**: Ensure all backends have `app.set('trust proxy', 1)` (which we already implemented) as the GRP will be the immediate sender of requests.
