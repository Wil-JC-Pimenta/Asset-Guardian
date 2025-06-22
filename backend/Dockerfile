# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy backend source code
COPY backend/ .

# Generate Prisma client
RUN npx prisma generate

# Expose backend port
EXPOSE 4000

# Start the backend server
CMD ["npm", "run", "start"]
