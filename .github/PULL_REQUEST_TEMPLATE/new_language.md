name: Add new language
description: Adding a new language file
body:
  - type: checkboxes
    id: format
    attributes:
      label: Format compliance
      options:
        - label: I made sure that the new JSON language file is named according to [RFC 3066](http://i18nguy.com/unicode/language-identifiers.html)
          required: true