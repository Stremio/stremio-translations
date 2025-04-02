import json
import os
import sys


def load_json(file_path):
    """Loads JSON data from a file."""
    if not os.path.isfile(file_path):
        return None  # Return None if file does not exist
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


def generate_xcode_strings(input_path, output_path, lang_code, lang_path, en_us_path):
    # Load the existing Xcode strings file and target language JSON
    input_xcstrings = load_json(input_path)
    lang_data = load_json(lang_path)
    en_data = load_json(en_us_path)  # May return None if en_us_path does not exist

    # Clone the structure of the input file
    xcode_format = input_xcstrings

    # List of keys to ignore for translation match checks
    ignore_keys = {"EPISODE_ABBREVIATION", "EMAIL"}  # Add more keys as needed

    # Process strings that already exist in the input Xcode strings
    for key in input_xcstrings.get("strings", {}):
        lang_value = lang_data.get(key)
        en_value = en_data.get(key) if en_data else None  # Get English value if en_us.json exists

        # Skip keys with no translation in the target language
        if not lang_value:
            continue

        # Skip keys if translation matches English value, unless the key is in the ignore list
        # This check is bypassed entirely if en_us.json is missing
        if en_data and key not in ignore_keys and lang_value == en_value:
            # Ensure `localizations` exists before trying to modify it
            if "localizations" in xcode_format["strings"][key]:
                xcode_format["strings"][key]["localizations"].pop(lang_code, None)
            continue

        # Ensure `localizations` exists for the key
        if "localizations" not in xcode_format["strings"][key]:
            xcode_format["strings"][key]["localizations"] = {}

        # Add or update the target language localization
        xcode_format["strings"][key]["localizations"][lang_code] = {
            "stringUnit": {
                "state": "translated",
                "value": lang_value
            }
        }

    # Write the updated Xcode strings file to the output path
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(xcode_format, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    # Validate arguments
    if len(sys.argv) != 6:
        print("Usage: script.py <input_path> <output_path> <language_code> <lang_path> <en_us_path>")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]
    language_code = sys.argv[3]
    lang_json_path = sys.argv[4]
    en_us_json_path = sys.argv[5]

    # Check if paths are valid
    for path in [input_path, lang_json_path]:
        if not os.path.isfile(path):
            print(f"Error: File not found - {path}")
            sys.exit(1)

    # Generate Xcode strings
    generate_xcode_strings(input_path, output_path, language_code, lang_json_path, en_us_json_path)
    print(f"Updated Xcode strings file generated at: {output_path}")
