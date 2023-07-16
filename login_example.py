import requests

req = requests.post(
    f"http://localhost:3000/auth/login", json={"account": "asdfgh", "password": "zxcqwe"}
)
jwtToken = req.json()["access_token"]

req = requests.get(
    f"http://localhost:3000/user/A124",
    headers={"Authorization": f"Bearer {jwtToken}"},
)

print(req.json())
