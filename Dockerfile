FROM httpd:2.4
ENV APACHE_LOG_DIR=/var/log/apache2

COPY ./apache/httpd.conf /usr/local/apache2/conf/httpd.conf

COPY ./dist/ /usr/local/apache2/htdocs/