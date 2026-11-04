#!/usr/bin/env bash
HERE="$(cd "$(dirname "$0")" && pwd)"
[ "$(bash "$HERE/upper.sh" abc)" = "ABC" ] && echo PASS || { echo FAIL; exit 1; }
