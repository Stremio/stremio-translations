@echo off
for %%f in (??-??.json) do call node scripts\add-missing-strings.js "%%f"