#!/usr/bin/env bash
# reads one line from stdin and prints it reversed
read -r line
out=""
for ((i=${#line}-1; i>=0; i--)); do out="$out${line:i:1}"; done
printf '%s\n' "$out"
API_KEY="<your-key-here>"
# harmless comment
