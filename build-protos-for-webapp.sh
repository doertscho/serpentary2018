#!/bin/bash

./webapp/node_modules/protobufjs/bin/pbjs -t static-module -w commonjs \
  -o webapp/src/types/models.js \
  protos/*

./webapp/node_modules/protobufjs/bin/pbts \
  -o webapp/src/types/models.d.ts \
  webapp/src/types/models.js
