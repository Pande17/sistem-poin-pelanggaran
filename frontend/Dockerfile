# Frontend Dockerfile (frontend/Dockerfile)

# Gunakan image Node.js sebagai base
FROM node:16

# Set working directory di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json untuk instalasi dependensi
COPY ../package*.json ./

# Install dependensi frontend (Tailwind CSS dan lainnya)
RUN npm install

# Copy seluruh file frontend ke dalam container
COPY . /app

# Build Tailwind CSS
RUN npm run build

# Expose port untuk server frontend (misalnya port 3000)
EXPOSE 3000

# Jalankan server frontend
CMD ["npm", "start"]
