# Step 1: Build the frontend application using Node.js
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project into the container
COPY . .

# Build the app for production
RUN npm run build

# Step 2: Serve the built app using Nginx
FROM nginx:alpine

# Remove the default Nginx welcome page
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/

# Copy the build files from the builder image to Nginx's public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]