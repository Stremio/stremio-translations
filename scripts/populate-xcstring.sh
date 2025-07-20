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
  "bn ../bn-BD.json $EN_JSON_PATH"
  "ca ../ca-CA.json $EN_JSON_PATH"
  "cs ../cs-CZ.json $EN_JSON_PATH"
  "da ../da-DK.json $EN_JSON_PATH"
  "de ../de-DE.json $EN_JSON_PATH"
  "el ../el-GR.json $EN_JSON_PATH"
  "eo ../eo-EO.json $EN_JSON_PATH"
  "es ../es-ES.json $EN_JSON_PATH"
  "et ../et-EE.json $EN_JSON_PATH"
  "eu ../eu-ES.json $EN_JSON_PATH"
  "fa ../fa-IR.json $EN_JSON_PATH"
  "fi ../fi-FI.json $EN_JSON_PATH"
  "fr ../fr-FR.json $EN_JSON_PATH"
  "he ../he-IL.json $EN_JSON_PATH"
  "hi ../hi-IN.json $EN_JSON_PATH"
  "hr ../hr-HR.json $EN_JSON_PATH"
  "hu ../hu-HU.json $EN_JSON_PATH"
  "id ../id-ID.json $EN_JSON_PATH"
  "it ../it-IT.json $EN_JSON_PATH"
  "ja ../ja-JP.json $EN_JSON_PATH"
  "ko ../ko-KR.json $EN_JSON_PATH"
  "lv ../lv-LV.json $EN_JSON_PATH"
  "mk ../mk-MK.json $EN_JSON_PATH"
  "my ../my-BM.json $EN_JSON_PATH"
  "nb ../nb-NO.json $EN_JSON_PATH"
  "ne ../ne-NP.json $EN_JSON_PATH"
  "nl ../nl-NL.json $EN_JSON_PATH"
  "nn ../nn-NO.json $EN_JSON_PATH"
  "pl ../pl-PL.json $EN_JSON_PATH"
  "pt-BR ../pt-BR.json $EN_JSON_PATH"
  "pt-PT ../pt-PT.json $EN_JSON_PATH"
  "ro ../ro-RO.json $EN_JSON_PATH"
  "ru ../ru-RU.json $EN_JSON_PATH"
  "sl ../sl-SL.json $EN_JSON_PATH"
  "sr ../sr-RS.json $EN_JSON_PATH"
  "sv ../sv-SE.json $EN_JSON_PATH"
  "te ../te-IN.json $EN_JSON_PATH"
  "tr ../tr-TR.json $EN_JSON_PATH"
  "uk ../uk-UA.json $EN_JSON_PATH"
  "vi ../vi-VN.json $EN_JSON_PATH"
  "zh-CN ../zh-CN.json $EN_JSON_PATH"
  "zh-HK ../zh-HK.json $EN_JSON_PATH"
  "zh-TW ../zh-TW.json $EN_JSON_PATH"
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
