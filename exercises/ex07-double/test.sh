#!/usr/bin/env bash
echo 5 | bash double.sh | grep -qx 10 && echo PASS
