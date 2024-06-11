#!/bin/sh

[ $( pidof node ) ] || exit 1
[ $( pidof openvpn ) ] || exit 1
[ $( pidof transmission-daemon ) ] || exit 1
