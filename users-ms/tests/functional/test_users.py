import pytest
from users_ms.models.user_model import User

def test_create_user_success(client, headers):
    data = {
        "name": "Ana",
        "last_name": "Gómez",
        "start_date": "2023-01-01",
        "retirement_date": "2025-01-01",
        "retirement_reason": "Finalizó contrato",
        "height": 1.65,
        "weight": 60.5,
        "age": 30,
        "arm": 25,
        "leg": 50,
        "chest": 85,
        "waist": 70
    }
    response = client.post('/users/', json=data, headers=headers)
    assert response.status_code == 201
    response_data = response.json
    assert response_data["name"] == "Ana"
    assert "id" in response_data

def test_create_user_missing_name(client, headers):
    data = {
        "last_name": "Gómez",
        "start_date": "2023-01-01",
        "retirement_date": "2025-01-01",
        "retirement_reason": "Finalizó contrato",
        "height": 1.65,
        "weight": 60.5,
        "age": 30,
        "arm": 25,
        "leg": 50,
        "chest": 85,
        "waist": 70
    }
    response = client.post('/users/', json=data, headers=headers)
    assert response.status_code == 400
    assert response.json['message'] == 'name is required'

def test_get_users_paginated(client, headers):
    for i in range(12):
        data = {
            "name": f"User {i}",
            "last_name": "Test",
            "start_date": "2023-01-01",
            "retirement_date": "2025-01-01",
            "retirement_reason": "Ninguna",
            "height": 1.70,
            "weight": 70.0,
            "age": 25 + i,
            "arm": 25,
            "leg": 50,
            "chest": 90,
            "waist": 70
        }
        client.post('/users/', json=data, headers=headers)

    response = client.get('/users?page=1&per_page=10', headers=headers)
    assert response.status_code == 200
    data = response.json
    assert 'users' in data
    assert 'page' in data
    assert data['page'] == 1
    assert len(data['users']) == 10

def test_get_user_by_id(client, headers):
    data = {
        "name": "Luis",
        "last_name": "Pérez",
        "start_date": "2023-01-01",
        "retirement_date": "2024-01-01",
        "retirement_reason": "Voluntario",
        "height": 1.72,
        "weight": 70.0,
        "age": 28,
        "arm": 28,
        "leg": 52,
        "chest": 88,
        "waist": 74
    }
    response = client.post('/users/', json=data, headers=headers)
    user_id = response.json['id']

    response = client.get(f'/users/{user_id}', headers=headers)
    assert response.status_code == 200
    assert response.json['id'] == user_id

    response = client.get('/users/999999', headers=headers)
    assert response.status_code == 404
    assert response.json['message'] == 'user not found'

def test_update_user(client, headers):
    data = {
        "name": "Pedro",
        "last_name": "Lopez",
        "start_date": "2022-01-01",
        "retirement_date": "2024-06-01",
        "retirement_reason": "Personal",
        "height": 1.80,
        "weight": 75.0,
        "age": 35,
        "arm": 30,
        "leg": 55,
        "chest": 95,
        "waist": 80
    }
    response = client.post('/users/', json=data, headers=headers)
    user_id = response.json['id']

    update_data = data.copy()
    update_data['name'] = "Pedro Updated"
    update_data['age'] = 36

    response = client.put(f'/users/{user_id}', json=update_data, headers=headers)
    assert response.status_code == 200
    assert response.json['name'] == 'Pedro Updated'
    assert response.json['age'] == 36

    response = client.put('/users/999999', json=update_data, headers=headers)
    assert response.status_code == 404
    assert response.json['message'] == 'user not found'

def test_delete_user(client, headers):
    data = {
        "name": "Carlos",
        "last_name": "Martinez",
        "start_date": "2022-02-01",
        "retirement_date": "2024-03-01",
        "retirement_reason": "Otro",
        "height": 1.75,
        "weight": 68.0,
        "age": 32,
        "arm": 27,
        "leg": 53,
        "chest": 87,
        "waist": 75
    }
    response = client.post('/users/', json=data, headers=headers)
    user_id = response.json['id']

    response = client.delete(f'/users/{user_id}', headers=headers)
    assert response.status_code == 200
    assert response.json['message'] == 'user deleted'

    response = client.delete('/users/999999', headers=headers)
    assert response.status_code == 404
    assert response.json['message'] == 'user not found'
