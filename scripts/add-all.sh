#!/usr/bin/env bash
ls *-*.json | grep -v 'package-lock.json' | while read line; do ./scripts/add-missing-strings.js $line; done
