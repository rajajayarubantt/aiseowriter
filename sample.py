import json

# Expanded mapping of languages (ISO 639-1) to a default country code (ISO 3166-1)
language_country_map = {
    "en": ("English", "US"),
    "es": ("Spanish", "ES"),
    "fr": ("French", "FR"),
    "de": ("German", "DE"),
    "hi": ("Hindi", "IN"),
    "zh": ("Chinese", "CN"),
    "ja": ("Japanese", "JP"),
    "ko": ("Korean", "KR"),
    "ru": ("Russian", "RU"),
    "ar": ("Arabic", "SA"),
    "pt": ("Portuguese", "PT"),
    "it": ("Italian", "IT"),
    "bn": ("Bengali", "BD"),
    "tr": ("Turkish", "TR"),
    "ta": ("Tamil", "IN"),
    "te": ("Telugu", "IN"),
    "ur": ("Urdu", "PK"),
    "fa": ("Persian", "IR"),
    "vi": ("Vietnamese", "VN"),
    "th": ("Thai", "TH"),
    "id": ("Indonesian", "ID"),
    "ms": ("Malay", "MY"),
    "sw": ("Swahili", "KE"),
    "pl": ("Polish", "PL"),
    "uk": ("Ukrainian", "UA"),
    "ro": ("Romanian", "RO"),
    "nl": ("Dutch", "NL"),
    "el": ("Greek", "GR"),
    "he": ("Hebrew", "IL"),
    "hu": ("Hungarian", "HU"),
    "cs": ("Czech", "CZ"),
    "sv": ("Swedish", "SE"),
    "fi": ("Finnish", "FI"),
    "no": ("Norwegian", "NO"),
    "da": ("Danish", "DK"),
    "bg": ("Bulgarian", "BG"),
    "sr": ("Serbian", "RS"),
    "hr": ("Croatian", "HR"),
    "sk": ("Slovak", "SK"),
    "sl": ("Slovenian", "SI"),
    "et": ("Estonian", "EE"),
    "lv": ("Latvian", "LV"),
    "lt": ("Lithuanian", "LT"),
    "am": ("Amharic", "ET"),
    "ne": ("Nepali", "NP"),
    "si": ("Sinhala", "LK"),
    "my": ("Burmese", "MM"),
    "km": ("Khmer", "KH"),
    "lo": ("Lao", "LA"),
    "mn": ("Mongolian", "MN")
}

# Base URL for flag SVGs (using flag-icons CDN)
flag_base_url = "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3"

# Build JSON list
languages_with_flags = []
for code, (name, country) in language_country_map.items():
    languages_with_flags.append({
        "label": name + f" ({country})",
        "code": code,
        "icon": f"{flag_base_url}/{country.lower()}.svg"
    })

print(len(languages_with_flags))
# Save to JSON file
with open("languages_with_flags.json", "w", encoding="utf-8") as f:
    json.dump(languages_with_flags, f, indent=2, ensure_ascii=False)

print(f"✅ Generated {len(languages_with_flags)} languages in languages_with_flags.json")
