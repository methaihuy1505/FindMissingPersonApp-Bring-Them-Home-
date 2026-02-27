FROM php:8.2-cli

# Cài các extension Laravel cần
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libonig-dev libxml2-dev zip unzip curl git \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Cài Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Tạo thư mục app
WORKDIR /var/www

# Copy mã nguồn Laravel
COPY . .

# Cấp quyền cho storage và bootstrap/cache
RUN chmod -R 775 storage bootstrap/cache

# Cài package PHP
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Mở port 8000 để truy cập trực tiếp
EXPOSE 8000

# Chạy Laravel bằng artisan serve
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
