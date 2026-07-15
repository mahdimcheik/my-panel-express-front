# --- Stage 1: build the Angular SPA ---
FROM node:22-alpine AS build
WORKDIR /app

# Install deps first (better layer caching)
COPY package*.json ./
RUN npm ci

# Build the production bundle
COPY . .
RUN npm run build

# --- Stage 2: serve static files with nginx ---
FROM nginx:alpine

# Remove the default site, add ours
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# @angular/build:application emits browser assets under dist/<project>/browser
COPY --from=build /app/dist/my-panel-express/browser /usr/share/nginx/html

EXPOSE 80
