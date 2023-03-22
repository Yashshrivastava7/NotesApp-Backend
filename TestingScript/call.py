import requests
import json

URL = "http://localhost:8080"
TOKEN = None

def test_login(username, password):
    global TOKEN
    print("Testing Login Path")
    data = {
        'username': username,
        'password': password
    }
    r = requests.post(URL+"/login", data=data)
    print(r)
    data = json.loads(r.text)
    print(data)
    TOKEN = data['AccessToken']
    print("TOKEN: ", TOKEN)

def test_signup(username, password):
    print("Testing Signup Path")
    creds = {
        "username": username,
        "password": password
    }
    r = requests.post(URL+"/signup", json=creds)
    print(r)
    print(r.text)
    
def test_root():
    print("Testing Root Path")
    r = requests.get(URL+"/")
    print(r)
    print(r.text)

def test_add_note(note):
    print("Testing Add Note")
    assert(TOKEN is not None)
    headers = {
        "Authorization": "Bearer " + TOKEN
    }
    r = requests.post(URL+"/notes", json=note, headers=headers)
    print(r)
    print(r.text)

def test_get_all_notes():
    print("Testing Get All Notes")
    assert(TOKEN is not None)
    headers = {
        "Authorization": "Bearer " + TOKEN
    }
    r = requests.get(URL+"/notes", headers=headers)
    print(r)
    print(r.json())
    return r.json()

def test_get_note(id):
    print("Testing Get Single Note")
    assert(TOKEN is not None)
    headers = {
        "Authorization": "Bearer " + TOKEN
    }
    r = requests.get(URL+"/notes/"+id, headers=headers)
    print(r)
    print(r.text)

def test_delete_note(id):
    print("Testing Delete Note")
    assert(TOKEN is not None)
    headers = {
        "Authorization": "Bearer " + TOKEN
    }
    r = requests.delete(URL+"/notes/"+id, headers=headers)
    print(r)
    print(r.text)
    
if __name__ == '__main__':
    username = "TestUsername1"
    password = "TestPassword1"
    test_root()
    test_signup(username, password)
    test_login(username, password)

    note1 = {
        "title": "Title1",
        "note": "Test Note 1"
    }
    note2 = {
        "title": "Title2",
        "note": "Test Note 2"
    }
    test_add_note(note1)
    test_add_note(note2)
    notes = test_get_all_notes()
    print(notes)
    ids = []
    for note in notes:
        test_get_note(note['_id'])
        ids.append(note['_id'])

    for id in ids:
        test_delete_note(id)

    test_get_all_notes()

    
