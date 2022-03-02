#!/bin/sh

# Creates certificates which have as root certificate myCA.pem
# This is helpfull if you add myCA.pem as trusted certificate in your browser 
# so you don't have to worry about https errors. All certificates generated 
# with this script will be trusted.

# Execute this to create your own Certificate authority:

#openssl genrsa -des3 -out myCA.key 2048
#openssl req -x509 -new -nodes -key myCA.key -sha256 -days 1825 -out myCA.pem

# See https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/
# for more information.

if [ "$#" -ne 1 ]
then
  echo "Usage: Must supply a domain"
  exit 1
fi

DOMAIN=$1

cd ~/certs

openssl genrsa -out $DOMAIN.key 2048
openssl req -new -key $DOMAIN.key -out $DOMAIN.csr

cat > $DOMAIN.ext << EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = $DOMAIN
EOF

openssl x509 -req -in $DOMAIN.csr -CA myCA.pem -CAkey myCA.key -CAcreateserial \
-out $DOMAIN.crt -days 825 -sha256 -extfile $DOMAIN.ext

openssl pkcs12 -export -in $DOMAIN.crt -inkey $DOMAIN.key -out $DOMAIN.p12
