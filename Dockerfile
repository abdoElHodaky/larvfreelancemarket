FROM richarvey/nginx-php-fpm:1.9.1
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN apk add -U --no-cache nghttp2-dev unzip build-base tzdata autoconf curl
RUN docker-php-ext-install pcntl 
RUN pecl install redis && docker-php-ext-enable redis
COPY . /var/www/html

ENV NVM_DIR /usr/local/nvm # or ~/.nvm 

ENV NODE_VERSION 16

ENV SKIP_COMPOSER=0
ENV PHP_ERRORS_STDERR=1
ENV RUN_SCRIPTS=1
ENV REAL_IP_HEADER=1

# Laravel config
ENV APP_KEY=base64:M29iYjc3dXY1bHp2eWZjejZiZDhrNzc2ZWNyM3JjOHU=
ENV APP_ENV=production
ENV APP_DEBUG=true
ENV LOG_CHANNEL=stderr
ENV APP_URL=0.0.0.0

# Allow composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV NODEJS_ALLOW_SUPERUSER=1
ENV NPM_ALLOW_SUPERUSER=1
ENV YARN_ALLOW_SUPERUSER=1
ENV NPX_ALLOW_SUPERUSER=1
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash && \
    . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default


RUN echo 'pm.max_children = 15' >> /usr/local/etc/php-fpm.d/zz-docker.conf && \
echo 'pm.max_requests = 500' >> /usr/local/etc/php-fpm.d/zz-docker.conf
RUN chmod -R 777 . && \
composer install && npm install && \
php artisan storage:link 
RUN  php artisan vendor:publish --tag=laravel-assets --ansi --force && \
npm run prod
#RUN php artisan migrate --force && php artisan db:seed --force
#RUN php artisan scout:import
EXPOSE 8080
