#!/usr/bin/env nix-shell
#! nix-shell -i bash --pure
#! nix-shell -p bash cacert curl jq python3Packages.xmljson
#! nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/22723a1d7deab53e5c1022906089e4247a5d3e77.tar.gz


curl https://github.com/NixOS/nixpkgs/releases.atom | xml2json | jq .
