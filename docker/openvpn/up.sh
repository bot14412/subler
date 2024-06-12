#!/bin/sh

su subler -c "setsid /bin/sh /app/openvpn/start.sh $route_vpn_gateway $ifconfig_local &"
