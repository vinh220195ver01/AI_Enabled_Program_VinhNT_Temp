#!/usr/bin/env bash
cd "$(dirname "$0")"
[ "$(bash wc.sh "a b c")" = 3 ] && [ "$(bash wc.sh "")" = 0 ] && echo PASS || { echo FAIL; exit 1; }
