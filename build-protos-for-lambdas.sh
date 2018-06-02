#!/bin/bash

protoc -I=./protos --go_out=./lambdas/src/models ./protos/*
