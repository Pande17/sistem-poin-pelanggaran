# Backend Dockerfile
# Gunakan image PHP dengan Apache
FROM php:8.0-apache

# Install PHP extensions yang diperlukan (misalnya, untuk MySQL)
RUN docker-php-ext-install pdo pdo_mysql

# Salin file konfigurasi Apache dan PHP (Jika ada)
# COPY ./backend/config/000-default.conf /etc/apache2/sites-available/000-default.conf

# Install Composer untuk PHP (jika diperlukan)
# RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Salin file aplikasi backend ke dalam container
COPY . /var/www/html/

# Install dependencies backend menggunakan Composer
# RUN cd /var/www/html && composer install

# Expose port untuk Apache
EXPOSE 80

# Jalankan Apache di foreground
CMD ["apache2-foreground"]
