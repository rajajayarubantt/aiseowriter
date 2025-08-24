import json
import re

def fix_and_validate_json(json_str: str):
    """
    Try to validate and fix a JSON string by adding missing commas.
    Returns a Python dict if successful, raises ValueError otherwise.
    """

    # First, try parsing directly
    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        pass  # Continue to fixing step

    # Fix: Add missing commas between } { or ] [
    fixed = re.sub(r'}\s*{', '}, {', json_str)
    fixed = re.sub(r'"\s*"', '", "', fixed)  # between strings
    fixed = re.sub(r'(\d)\s*"', r'\1, "', fixed)  # number before string
    fixed = re.sub(r'"\s*(\d)', r'", \1', fixed)  # string before number
    fixed = re.sub(r'}\s*"', '}, "', fixed)
    fixed = re.sub(r'"\s*}', '", }', fixed)
    fixed = re.sub(r']\s*"', '], "', fixed)
    fixed = re.sub(r'"\s*\[', '", [', fixed)

    # Try parsing again
    try:
        return json.loads(fixed)
    except json.JSONDecodeError as e:
        raise ValueError(f"Could not fix JSON: {e}\nFixed string:\n{fixed}")

# Example usage
broken_json = '''
{
  "name": "Alice"
  "age": 25
  "skills": ["Python" "React"]
  "active": true
}
'''

fixed_obj = fix_and_validate_json(broken_json)
print(fixed_obj)
