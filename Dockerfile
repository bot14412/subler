FROM alpine:latest AS build
WORKDIR /app

COPY . .
RUN apk add --no-cache nodejs-current yarn
RUN yarn && yarn build


FROM alpine:latest
WORKDIR /app

LABEL org.opencontainers.image.source="https://github.com/bot14412/subler"
LABEL org.opencontainers.image.description="Torrent client with media convertion"
LABEL org.opencontainers.image.licenses="MIT"

ENV USER_UID=
ENV USER_GID=
ENV PIA_USER=
ENV PIA_PASS=
EXPOSE 3000
VOLUME /data

COPY docker .
COPY --from=build /app/build /app/package.json .
RUN apk add --no-cache \
    tini iptables openvpn curl jq \
    transmission-daemon transmission-cli \
    ffmpeg mkvtoolnix \
    nodejs-current yarn

HEALTHCHECK --interval=300s --start-period=600s CMD /app/check.sh
CMD ["/sbin/tini", "--", "/app/run.sh"]
