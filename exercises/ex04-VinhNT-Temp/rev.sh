#!/usr/bin/env bash
# Print the first argument reversed.
s="$1"; out=""
for ((i=${#s}-1; i>=0; i--)); do out="$out${s:i:1}"; done
printf '%s\n' "$out"
