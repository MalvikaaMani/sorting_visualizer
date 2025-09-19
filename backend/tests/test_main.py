from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_sorting_endpoint():
    response = client.post("/sort", json={"array": [5, 3, 1, 4]})
    assert response.status_code == 200
    assert response.json()["sorted"] == [1, 3, 4, 5]
