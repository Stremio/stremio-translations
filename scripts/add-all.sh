#!/usr/bin/env bash
ls ??-??.json | while read line; do ./scripts/add-missing-strings.js $line; done
