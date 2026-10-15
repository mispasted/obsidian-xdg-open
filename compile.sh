#!/usr/bin/env bash

nix shell nixpkgs#esbuild -c esbuild main.ts \
  --bundle --platform=node --target=es2018 \
  --external:obsidian --outfile=main.js