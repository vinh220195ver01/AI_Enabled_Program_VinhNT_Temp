#!/usr/bin/env bash
cd "$(dirname "$0")" || exit 1
[ "$(bash rev.sh abc)" = "cba" ] || { echo FAIL abc; exit 1; }
[ "$(bash rev.sh "")" = "" ] || { echo FAIL empty; exit 1; }
echo PASS
