#!/bin/sh

pgrep -f node
[ $( pidof node ) ] || exit 1
[ $( pidof openvpn ) ] || exit 1
[ $( pidof transmission-daemon ) ] || exit 1
[ $( pgrep -f start.sh ) ] || exit 1
transmission-remote -pt > /dev/null || exit 1
