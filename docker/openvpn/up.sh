#!/bin/sh

echo "Starting transmission on $ifconfig_local"
su subler -c "/usr/bin/transmission-daemon --foreground --config-dir /data/config --peerport $PEER_PORT --bind-address-ipv4 $ifconfig_local &"
