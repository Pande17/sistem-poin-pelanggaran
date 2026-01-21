# Backend Dockerfile (backend/Dockerfile)

# Gunakan image PHP dengan Apache
FROM php:8.1-apache

# Install dependensi yang diperlukan untuk PHP dan ekstensi MySQL
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    zip \
    git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql

# Enable Apache mod_rewrite untuk routing
RUN a2enmod rewrite

# Set working directory di dalam container
WORKDIR /var/www/html

# Copy seluruh file backend ke dalam container
COPY . /var/www/html/

# Install Composer untuk PHP (dependensi backend)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install dependensi PHP
RUN composer install

# Expose port 80 untuk akses Apache
EXPOSE 80

# Jalankan Apache di foreground
CMD ["apache2-foreground"]
