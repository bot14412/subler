FROM alpine:latest AS build
WORKDIR /app

COPY . .
RUN apk add --no-cache nodejs npm
RUN npm install && npm run build


FROM alpine:latest
WORKDIR /app

ENV USER_UID=
ENV USER_GID=
ENV PIA_USER=
ENV PIA_PASS=
EXPOSE 8080
VOLUME /data

COPY docker .
COPY --from=build /app/build /app/package.json .
RUN apk add --no-cache tini openvpn curl jq \
    transmission-daemon transmission-remote ffmpeg nodejs

HEALTHCHECK --interval=300s --start-period=600s CMD /app/check.sh
CMD ["/sbin/tini", "--", "/app/run.sh"]
