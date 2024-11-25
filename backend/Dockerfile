# Base Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire backend code
COPY . .

# Expose the backend port
EXPOSE 3001

# Start the backend
CMD ["npm", "start"]