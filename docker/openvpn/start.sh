#!/bin/sh

remote_ip=$1
local_ip=$2

bind_port() {
    now=$( date +%s )
    prev_port=${port:-0}

    if [ ${token_expiration:-0} -le $now ]; then
        user=$( head -1 /app/openvpn/credentials)
        pass=$( tail -1 /app/openvpn/credentials)
        response=$( curl -s -L -F "username=$user" -F "password=$pass" https://www.privateinternetaccess.com/api/client/v2/token )

        [ $( echo $response | jq -r .token ) = "" ] || { echo "Generate token failed" ; return 1 ; }

        token=$( echo $response | jq -r .token )
        token_expiration=$(( $now + 86400 ))
    fi

    if [ ${signature_expiration:-0} -le $now ]; then
        response=$( curl -Gks -m 5 --data-urlencode "token=${token}" "https://${remote_ip}:19999/getSignature" )

        [ "$( echo "$response" | jq -r .status )" = "OK" ] || { echo "Get signature failed" ; return 1; }

        signature=$( echo $response | jq -r .signature )
        signature_payload=$( echo $response | jq -r .payload )
        port=$( echo $signature_payload | base64 -d | jq -r .port )
        signature_expiration_raw=$( echo $signature_payload | base64 -d | jq -r .expires_at )
        signature_expiration=$( date -D %Y-%m-%dT%H:%M:%S --date="$signature_expiration_raw" +%s )
        port_expiration=0
    fi

    if [ $port != $prev_port ]; then
        echo "Setting transmission port to $port"
        transmission-remote -p $port > /dev/null
    fi

    response=$( curl -Gks -m 5 \
        --data-urlencode "signature=$signature" \
        --data-urlencode "payload=$signature_payload" \
        "https://${remote_ip}:19999/bindPort" )

    [ "$( echo "$response" | jq -r .status )" = "OK" ] || { echo "Bind port failed" ; return 1; }
}

echo "Starting transmission on $local_ip"
/usr/bin/transmission-daemon --foreground --config-dir /data/config --bind-address-ipv4 $local_ip &
sleep 2

while true; do
    bind_port
    sleep 900
done
