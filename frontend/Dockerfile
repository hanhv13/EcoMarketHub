FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 5173

# Start Vite with --host to allow external access
CMD ["npm", "run", "dev", "--", "--host"]
