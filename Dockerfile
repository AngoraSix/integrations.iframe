# Dockerfile
FROM node:10-slim as builder
WORKDIR /opt/api
COPY . .
RUN echo $BUILD
RUN npm install
RUN NODE_ENV=production npm run build:prod

FROM node:10-slim as runner
COPY --from=builder /opt/api/package.json ./package.json
COPY --from=builder /opt/api/package-lock.json ./package-lock.json
COPY --from=builder /opt/api/static ./static
COPY --from=builder /opt/api/dist .
ARG BUILD
ENV BUILD $BUILD
RUN npm install --production
RUN rm package.json package-lock.json
EXPOSE 80 3002
ENTRYPOINT [ "node", "app.js" ]
CMD [ ]