# Backend image — Node/Express ledger API.
# Small base, production deps only, runs as a non-root user.
FROM node:20-alpine

WORKDIR /app

# Install production dependencies first (cached unless package files change).
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy the application source.
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

# Drop root privileges (the node image ships a "node" user).
USER node

CMD ["node", "server.js"]
