# Frontend Dockerfile
FROM node:16

# Set working directory
WORKDIR /app

# Salin package.json dan package-lock.json
COPY ./frontend/package.json ./frontend/package-lock.json ./

# Install dependencies
RUN npm install

# Salin semua file frontend ke dalam container
COPY . /app

# Jalankan build Tailwind CSS
RUN npm run build

# Expose port untuk server frontend (jika ada)
EXPOSE 3000

# Jalankan server (misalnya, menggunakan Live Server atau server lain)
CMD ["npm", "start"]
