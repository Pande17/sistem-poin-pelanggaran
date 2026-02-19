FROM php:8.2-apache

# Menyalin file konfigurasi Apache ke direktori konfigurasi Apache di dalam kontainer
COPY ./000-default.conf /etc/apache2/sites-available/000-default.conf

# Menyalin file konfigurasi Apache utama ke dalam kontainer
COPY ./apache2.conf /etc/apache2/apache2.conf

# Menyalin aplikasi ke dalam kontainer
COPY . /var/www/html/

# Install PHP extensions yang diperlukan (misalnya, untuk MySQL)
RUN docker-php-ext-install pdo pdo_mysql

# Enable mod_rewrite untuk URL rewriting
RUN a2enmod rewrite

# Salin file aplikasi backend ke dalam container
WORKDIR /var/www/html/