import requests
import json
from decorate import decorate

URL = "http://localhost:8080"
TOKEN = None

sesh = requests.Session()

@decorate
def test_login(username, password):
    global TOKEN
    print(f"Testing Login Path for Username: {username} and Password: {password}")
    data = {"username": username, "password": password}
    r = sesh.post(URL + "/login", json=data)
    print(r)
    data = json.loads(r.text)
    print(data)
    TOKEN = data["AccessToken"]


@decorate
def test_signup(username, password):
    print(f"Testing Signup Path for Username: {username} and Password: {password}")
    creds = {"username": username, "password": password}
    r = sesh.post(URL + "/signup", json=creds)
    print(r)
    print(r.text)


@decorate
def test_root():
    print("Testing Root Path")
    r = sesh.get(URL + "/")
    print(r)
    print(r.text)


@decorate
def test_add_note(note):
    print(f"Testing Add Note for Note: {note}")
    assert TOKEN is not None
    headers = {"Authorization": "Bearer " + TOKEN}
    r = sesh.post(URL + "/notes", json=note, headers=headers)
    print(r)
    print(r.text)


@decorate
def test_get_all_notes():
    print("Testing Get All Notes")
    assert TOKEN is not None
    headers = {"Authorization": "Bearer " + TOKEN}
    r = sesh.get(URL + "/notes", headers=headers)
    print(r)
    print(r.json())
    return r.json()


@decorate
def test_get_note(id):
    print(f"Testing Get Single Note for ID: {id}")
    assert TOKEN is not None
    headers = {"Authorization": "Bearer " + TOKEN}
    r = sesh.get(URL + "/notes/" + id, headers=headers)
    print(r)
    print(r.text)


@decorate
def test_delete_note(id):
    print(f"Testing Delete Single Note for ID: {id}")
    assert TOKEN is not None
    headers = {"Authorization": "Bearer " + TOKEN}
    r = sesh.delete(URL + "/notes/" + id, headers=headers)
    print(r)
    print(r.text)


if __name__ == "__main__":
    username = "TestUsername1"
    password = "TestPassword1"
    test_root()
    test_signup(username, password)
    test_login(username, password)

    note1 = {"title": "Title1", "note": "Test Note 1"}
    note2 = {"title": "Title2", "note": "Test Note 2"}
    test_add_note(note1)
    test_add_note(note2)
    notes = test_get_all_notes()
    print(notes)
    ids = []
    for note in notes:
        test_get_note(note["_id"])
        ids.append(note["_id"])

    for id in ids:
        test_delete_note(id)

    test_get_all_notes()
