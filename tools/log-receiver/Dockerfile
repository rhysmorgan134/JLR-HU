FROM node:22-alpine

WORKDIR /app
COPY server.js ./server.js

ENV PORT=4318
ENV LOG_DIRECTORY=/data
EXPOSE 4318
VOLUME ["/data"]

CMD ["node", "server.js"]
