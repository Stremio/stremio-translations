#!/bin/bash

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <path_to_input_xcstrings> <path_to_output_xcstrings>"
  exit 1
fi

# Assign the first two arguments to variables for the xcstrings paths
XCSTRINGS_PATH_1=$1 # Input file
XCSTRINGS_PATH_2=$2 # Output file
EN_JSON_PATH=$3  # Leave this part as "" in argument to write strings without checking if its localized or not(for compile only)

LANG_JSON_PAIRS=(
  "en ../en-US.json ''"
  "ar ../ar-AR.json $EN_JSON_PATH"
  "bg ../bg-BG.json $EN_JSON_PATH"
  "nl ../nl-NL.json $EN_JSON_PATH"
  "fr ../fr-FR.json $EN_JSON_PATH"
  "de ../de-DE.json $EN_JSON_PATH"
  "pt-BR ../pt-BR.json $EN_JSON_PATH"
  "pt-PT ../pt-PT.json $EN_JSON_PATH"
  "ro ../ro-RO.json $EN_JSON_PATH"
  "ru ../ru-RU.json $EN_JSON_PATH"
  "es ../es-ES.json $EN_JSON_PATH"
  "tr ../tr-TR.json $EN_JSON_PATH"
  "uk ../uk-UA.json $EN_JSON_PATH"
)

# Loop through the array and run the Python script
for lang_json_pair in "${LANG_JSON_PAIRS[@]}"
do
  # Split the pair into language and JSON files
  lang=$(echo $lang_json_pair | cut -d ' ' -f 1)
  json_files=$(echo $lang_json_pair | cut -d ' ' -f 2-)

  # Run the Python script with the given arguments
  python3 populate-xcstring.py "$XCSTRINGS_PATH_1" "$XCSTRINGS_PATH_2" "$lang" $json_files
done
