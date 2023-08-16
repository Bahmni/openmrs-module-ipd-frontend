FROM httpd:2.4-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache tzdata

COPY dist/federation/. /usr/local/apache2/htdocs/ipd/
