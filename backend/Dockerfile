FROM php:8.2-apache

# Install PHP extensions yang diperlukan (misalnya, untuk MySQL)
RUN docker-php-ext-install pdo pdo_mysql

# Salin file aplikasi backend ke dalam container
WORKDIR /var/www/html/