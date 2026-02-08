FROM alpine:3.20

RUN apk add --no-cache nginx \
  && mkdir -p /usr/share/nginx/html /run/nginx /var/lib/nginx /var/log/nginx /etc/nginx/http.d \
  && chown -R nginx:nginx /usr/share/nginx/html /run/nginx /var/lib/nginx /var/log/nginx

# Static site: mount under the required path prefix.
COPY public/lab/ /usr/share/nginx/html/demo/interactive/

# Very strict crawler directives.
COPY public/robots.txt /usr/share/nginx/html/robots.txt

# Nginx: add X-Robots-Tag and serve /demo/interactive.
COPY deploy/interactive/nginx.conf /etc/nginx/nginx.conf
COPY deploy/interactive/default.conf /etc/nginx/http.d/default.conf

USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
