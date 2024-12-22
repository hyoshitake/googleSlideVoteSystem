FROM node:23.5
WORKDIR /usr/src/app
COPY app/ .
RUN pwd
RUN ls -a
RUN npm ci
CMD ["node", "server.js"]
