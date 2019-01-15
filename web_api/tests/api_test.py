from app import app

test_app = app.test_client()

def test_home():
    result = test_app.get('/')
    assert result.status_code == 200
    assert result.data == b'Hello world'
