#! /bin/sh
echo "$(cd "$(dirname "$1")"; pwd -P)/$(basename "$1")"