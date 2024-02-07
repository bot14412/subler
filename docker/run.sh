#!/bin/sh

if [ -z "$( id -u subler 2> /dev/null )" ]; then
    sed -i "s/^\(users:x\):100:/\1:$USER_GID:/" /etc/group
    adduser -D -u "$USER_UID" -G users -g subler subler
    echo "$PIA_USER" > /app/openvpn/credentials
    echo "$PIA_PASS" >> /app/openvpn/credentials
    chmod 600 /app/openvpn/credentials
    chown subler:users /app/openvpn/credentials
fi

if [ ! -d /data/config ]; then
    mkdir -p /data/config
    cp -r /app/config/ /data/config
    chown -R subler:users /data/config
fi

mkdir -p /dev/net
mknod -m 666 /dev/net/tun c 10 200

echo "nameserver 1.1.1.1" > /etc/resolv.conf
echo "nameserver 1.0.0.1" >> /etc/resolv.conf

su subler -c "HOST=$( hostname -i ) PORT=8080 CONFIG_DIR=/data/config /usr/bin/node index.js &"
exec /usr/sbin/openvpn --config /app/openvpn/config.ovpn
