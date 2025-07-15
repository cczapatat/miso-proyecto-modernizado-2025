import pytest
from users_ms.models.user_model import User


def test_create_user_success(client, headers):
    data = {
        "name": "Ana",
        "last_name": "Gómez",
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
    # Asumo que tu endpoint devuelve 'message', si no, ajústalo
    assert 'message' in response.json


def test_get_users_paginated(client, headers):
    for i in range(12):
        client.post('/users/', json={
            "name": f"User {i}", "last_name": "Test", "age": 25 + i,
            "height": 1.70, "weight": 70.0, "arm": 25, "leg": 50,
            "chest": 90, "waist": 70
        }, headers=headers)

    response = client.get('/users/?page=1&per_page=10', headers=headers)
    
    assert response.status_code == 200
    data = response.json
    assert 'users' in data
    assert 'page' in data
    assert data['page'] == 1
    assert len(data['users']) == 10

def test_get_user_by_id(client, headers):
    data = {
        "name": "Luis", "last_name": "Pérez", "age": 28, "height": 1.72,
        "weight": 70.0, "arm": 28, "leg": 52, "chest": 88, "waist": 74
    }
    create_response = client.post('/users/', json=data, headers=headers)
    assert create_response.status_code == 201
    user_id = create_response.json['id']

    response = client.get(f'/users/{user_id}', headers=headers)
    assert response.status_code == 200
    assert response.json['id'] == user_id

    response = client.get('/users/999999', headers=headers)
    assert response.status_code == 404
    assert response.json['message'] == 'user not found'



def test_update_user(client, headers):
    data = {
        "name": "Pedro", "last_name": "Lopez", "age": 35, "height": 1.80,
        "weight": 75.0, "arm": 30, "leg": 55, "chest": 95, "waist": 80
    }
    create_response = client.post('/users/', json=data, headers=headers)
    assert create_response.status_code == 201
    user_id = create_response.json['id']

    update_data = data.copy()
    update_data['name'] = "Pedro Actualizado"
    update_data['age'] = 36

    response = client.put(f'/users/{user_id}', json=update_data, headers=headers)
    assert response.status_code == 200
    assert response.json['name'] == 'Pedro Actualizado'
    assert response.json['age'] == 36

    response = client.put('/users/999999', json=update_data, headers=headers)
    assert response.status_code == 404
    assert response.json['message'] == 'user not found'


def test_delete_user(client, headers):
    data = {
        "name": "Carlos", "last_name": "Martinez", "age": 32, "height": 1.75,
        "weight": 68.0, "arm": 27, "leg": 53, "chest": 87, "waist": 75
    }
    create_response = client.post('/users/', json=data, headers=headers)
    assert create_response.status_code == 201
    user_id = create_response.json['id']

    response = client.delete(f'/users/{user_id}', headers=headers)
    assert response.status_code == 200
    assert response.json['message'] == 'user deleted'

    response = client.delete('/users/999999', headers=headers)
    assert response.status_code == 404
    assert response.json['message'] == 'user not found'

def test_withdraw_user_success(client, headers):
    create_data = { "name": "Usuario", "last_name": "A Retirar", "age": 40, "height": 1.80, "weight": 80, "arm": 30, "leg": 60, "chest": 100, "waist": 90 }
    create_res = client.post('/users/', json=create_data, headers=headers)
    assert create_res.status_code == 201
    user_id = create_res.json['id']

    withdraw_data = {
        "withdrawal_date": "2025-07-15",
        "withdrawal_reason": "Jubilación"
    }
    withdraw_res = client.put(f'/users/{user_id}/withdraw', json=withdraw_data, headers=headers)

    assert withdraw_res.status_code == 200
    response_data = withdraw_res.json
    assert response_data['withdrawal_date'] == "2025-07-15"
    assert response_data['withdrawal_reason'] == "Jubilación"

def test_create_user_invalid_data_type(client, headers):
    data = {
        "name": "Tipo",
        "last_name": "Incorrecto",
        "age": 30,
        "height": "muy alto",
        "weight": 70.5,
        "arm": 25,
        "leg": 50,
        "chest": 85,
        "waist": 70
    }
    response = client.post('/users/', json=data, headers=headers)
    assert response.status_code == 400
    assert response.json['message'] == 'height must be a positive number'

def test_create_user_with_missing_required_field(client, headers):
    data = {
        "name": "Campo Faltante",
        "last_name": "Prueba",
        "age": 25,
        "height": 1.75,
        "arm": 30,
        "leg": 55,
        "chest": 95,
        "waist": 80
    }
    response = client.post('/users/', json=data, headers=headers)
    assert response.status_code == 400
    assert response.json['message'] == 'weight is required'

def test_create_user_with_invalid_age_type(client, headers):
    data = {
        "name": "Edad Inválida",
        "last_name": "Prueba",
        "age": "veinticinco",
        "height": 1.75,
        "weight": 70,
        "arm": 30,
        "leg": 55,
        "chest": 95,
        "waist": 80
    }
    response = client.post('/users/', json=data, headers=headers)
    assert response.status_code == 400
    assert response.json['message'] == 'age must be a positive integer'

def test_withdraw_user_with_missing_data(client, headers):
    create_data = { "name": "Para Retirar", "last_name": "Incompleto", "age": 50, "height": 1.70, "weight": 70, "arm": 25, "leg": 50, "chest": 90, "waist": 70 }
    create_res = client.post('/users/', json=create_data, headers=headers)
    user_id = create_res.json['id']

    withdraw_data = {
        "withdrawal_reason": "Falta la fecha"
    }
    response = client.put(f'/users/{user_id}/withdraw', json=withdraw_data, headers=headers)
    
    assert response.status_code == 400
    assert response.json['message'] == 'withdrawal_date and withdrawal_reason are required'

def test_create_user_invalid_data_type(client, headers):
    data = {
        "name": "Tipo",
        "last_name": "Incorrecto",
        "age": 30,
        "height": "muy alto",
        "weight": 70.5,
        "arm": 25,
        "leg": 50,
        "chest": 85,
        "waist": 70
    }
    response = client.post('/users/', json=data, headers=headers)
    assert response.status_code == 400
    assert response.json['message'] == 'height must be a positive number'