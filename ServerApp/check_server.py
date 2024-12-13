import requests

def check_server():
    url = 'http://127.0.0.1:5000/health'
    data = {
        'heart_rate': 10,
    }
    response = requests.post(url, json=data)
    print(response)


check_server()