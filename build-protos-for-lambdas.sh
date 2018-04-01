#!/bin/bash

mkdir -p ./lambdas/src/models
rm -rf ./lambdas/src/models/*
protoc -I=./protos --go_out=./lambdas/src/models ./protos/*
