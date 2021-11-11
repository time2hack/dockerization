FROM alpine:3.14
RUN apk add --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/v3.14/main/ \
  nodejs-current \
  ffmpeg \
  bash \
  npm

RUN echo "\nNode: " && node -v \
    && echo "\nNPM: " && npm -v

ARG PORT
ENV PORT ${PORT:-3000}

ARG APP_DIR
ENV APP_DIR ${APP_DIR:-app}

WORKDIR ${APP_DIR}

COPY . .

CMD [ "chown ./temp" ]

RUN npm ci --prod

ENTRYPOINT [ "node", "index.js" ]