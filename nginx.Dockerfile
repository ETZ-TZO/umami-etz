FROM nginx:stable-alpine as production-stage
COPY nginx.conf /etc/nginx/nginx.conf
COPY ./certs /etc/nginx/certs
EXPOSE 8082
CMD ["nginx", "-g", "daemon off;"]