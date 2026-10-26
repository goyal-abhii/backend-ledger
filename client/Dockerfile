# Frontend image — build the React app, then serve it with nginx.
# nginx also reverse-proxies /api to the backend container, so the whole
# app is same-origin in production (no CORS, no backend changes).

# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# VITE_API_BASE_URL defaults to "/api" (see src/api/client.js), which nginx proxies.
RUN npm run build

# --- Serve stage ---
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
