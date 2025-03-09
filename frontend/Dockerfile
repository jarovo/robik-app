# Use a lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build React app
RUN npm run build

# Serve app with a lightweight server
RUN npm install -g serve
CMD ["serve", "-s", "build"]

# Expose frontend port
EXPOSE 3000
