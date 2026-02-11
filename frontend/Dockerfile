FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json & lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file frontend
COPY . .

# Expose port Vite
EXPOSE 5173

# Jalankan Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]