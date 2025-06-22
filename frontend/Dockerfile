# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source code
COPY frontend/ .

# Build the frontend
RUN npm run build

# Use a lightweight web server to serve the built files
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the frontend server
CMD ["serve", "-s", "dist", "-l", "3000"]
