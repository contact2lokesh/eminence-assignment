# Stage 1: Build Angular application
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine
# Copy built static files
COPY --from=builder /app/dist/multi-level-user-management/browser /usr/share/nginx/html
# Inject custom nginx configuration for routing and /api reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
