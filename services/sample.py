import requests

# {"cms": "686152cc948480e660696a31", "site": "68599e040043e25a6cdbdf9e", "post_status": "draft"}

auth_token = "3ff5e0c68f276a0aaf64068bf74ae2a007613e55ddd55a2dd0243ad2f084f709"
site_id = "686152cc948480e660696a31"

headers = {
    'Authorization': f'Bearer {auth_token}',
    'accept-version': '1.0.0'
}

# List all collections first
list_url = f"https://api.webflow.com/v2/collections/{site_id}"
response = requests.get(list_url, headers=headers)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")