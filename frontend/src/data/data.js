
import Icons from "../assets/Icons";

const LanguagesData = [
    {
        "label": "English (US)",
        "code": "en",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/us.svg"
    },
    {
        "label": "Spanish (ES)",
        "code": "es",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/es.svg"
    },
    {
        "label": "French (FR)",
        "code": "fr",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/fr.svg"
    },
    {
        "label": "German (DE)",
        "code": "de",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/de.svg"
    },
    {
        "label": "Hindi (IN)",
        "code": "hi",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/in.svg"
    },
    {
        "label": "Chinese (CN)",
        "code": "zh",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/cn.svg"
    },
    {
        "label": "Japanese (JP)",
        "code": "ja",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/jp.svg"
    },
    {
        "label": "Korean (KR)",
        "code": "ko",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/kr.svg"
    },
    {
        "label": "Russian (RU)",
        "code": "ru",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/ru.svg"
    },
    {
        "label": "Arabic (SA)",
        "code": "ar",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/sa.svg"
    },
    {
        "label": "Portuguese (PT)",
        "code": "pt",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/pt.svg"
    },
    {
        "label": "Italian (IT)",
        "code": "it",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/it.svg"
    },
    {
        "label": "Bengali (BD)",
        "code": "bn",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/bd.svg"
    },
    {
        "label": "Turkish (TR)",
        "code": "tr",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/tr.svg"
    },
    {
        "label": "Tamil (IN)",
        "code": "ta",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/in.svg"
    },
    {
        "label": "Telugu (IN)",
        "code": "te",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/in.svg"
    },
    {
        "label": "Urdu (PK)",
        "code": "ur",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/pk.svg"
    },
    {
        "label": "Persian (IR)",
        "code": "fa",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/ir.svg"
    },
    {
        "label": "Vietnamese (VN)",
        "code": "vi",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/vn.svg"
    },
    {
        "label": "Thai (TH)",
        "code": "th",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/th.svg"
    },
    {
        "label": "Indonesian (ID)",
        "code": "id",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/id.svg"
    },
    {
        "label": "Malay (MY)",
        "code": "ms",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/my.svg"
    },
    {
        "label": "Swahili (KE)",
        "code": "sw",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/ke.svg"
    },
    {
        "label": "Polish (PL)",
        "code": "pl",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/pl.svg"
    },
    {
        "label": "Ukrainian (UA)",
        "code": "uk",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/ua.svg"
    },
    {
        "label": "Romanian (RO)",
        "code": "ro",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/ro.svg"
    },
    {
        "label": "Dutch (NL)",
        "code": "nl",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/nl.svg"
    },
    {
        "label": "Greek (GR)",
        "code": "el",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/gr.svg"
    },
    {
        "label": "Hebrew (IL)",
        "code": "he",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/il.svg"
    },
    {
        "label": "Hungarian (HU)",
        "code": "hu",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/hu.svg"
    },
    {
        "label": "Czech (CZ)",
        "code": "cs",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/cz.svg"
    },
    {
        "label": "Swedish (SE)",
        "code": "sv",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/se.svg"
    },
    {
        "label": "Finnish (FI)",
        "code": "fi",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/fi.svg"
    },
    {
        "label": "Norwegian (NO)",
        "code": "no",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/no.svg"
    },
    {
        "label": "Danish (DK)",
        "code": "da",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/dk.svg"
    },
    {
        "label": "Bulgarian (BG)",
        "code": "bg",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/bg.svg"
    },
    {
        "label": "Serbian (RS)",
        "code": "sr",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/rs.svg"
    },
    {
        "label": "Croatian (HR)",
        "code": "hr",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/hr.svg"
    },
    {
        "label": "Slovak (SK)",
        "code": "sk",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/sk.svg"
    },
    {
        "label": "Slovenian (SI)",
        "code": "sl",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/si.svg"
    },
    {
        "label": "Estonian (EE)",
        "code": "et",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/ee.svg"
    },
    {
        "label": "Latvian (LV)",
        "code": "lv",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/lv.svg"
    },
    {
        "label": "Lithuanian (LT)",
        "code": "lt",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/lt.svg"
    },
    {
        "label": "Amharic (ET)",
        "code": "am",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/et.svg"
    },
    {
        "label": "Nepali (NP)",
        "code": "ne",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/np.svg"
    },
    {
        "label": "Sinhala (LK)",
        "code": "si",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/lk.svg"
    },
    {
        "label": "Burmese (MM)",
        "code": "my",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/mm.svg"
    },
    {
        "label": "Khmer (KH)",
        "code": "km",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/kh.svg"
    },
    {
        "label": "Lao (LA)",
        "code": "lo",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/la.svg"
    },
    {
        "label": "Mongolian (MN)",
        "code": "mn",
        "icon": "https://cdn.jsdelivr.net/npm/flag-icons/flags/4x3/mn.svg"
    }
]

export { LanguagesData }