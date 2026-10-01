from fastapi import Body
from fastapi.testclient import TestClient
from pydantic import BaseModel


def test_health_endpoint_is_available_without_database_startup_work():
    from app.main import create_app

    response = TestClient(create_app()).get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_request_validation_uses_the_uniform_error_envelope():
    from app.main import create_app

    class Payload(BaseModel):
        title: str

    app = create_app()

    @app.post("/validation")
    def validation(payload: Payload = Body(...)):
        return payload

    response = TestClient(app).post(
        "/validation",
        json={},
        headers={"Origin": "http://localhost:5173"},
    )

    assert response.status_code == 422
    payload = response.json()["error"]
    assert payload["code"] == "VALIDATION_ERROR"
    assert payload["field_errors"]
    assert payload["request_id"].startswith("req_")
