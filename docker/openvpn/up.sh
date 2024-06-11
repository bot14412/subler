#!/bin/sh

echo "Starting transmission on $ifconfig_local:$peer_port"
su subler -c "/usr/bin/transmission-daemon --foreground --config-dir /data/config --peerport $peer_port --bind-address-ipv4 $ifconfig_local &"
