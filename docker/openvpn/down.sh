#!/bin/sh

echo "Stopping transmission"

sid=$( ps -o sid,args | grep '[s]tart.sh\|[t]ransmission-daemon' | awk '{print $1; exit}' )
[ -n "$sid" ] && pkill -s "$sid"
