import pytest
from exercises_ms.models.exercise_model import Exercise


def test_create_exercise_success(client, headers):
    data = {
        'name': 'Push-ups',
        'description': 'Classic push-up exercise for upper body strength',
        'youtube': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'calories': 5
    }
    
    response = client.post('/exercises/', json=data, headers=headers)
    
    assert response.status_code == 201
    response_data = response.json
    
    assert 'id' in response_data
    assert response_data['name'] == 'Push-ups'
    assert response_data['description'] == 'Classic push-up exercise for upper body strength'
    assert response_data['youtube'] == 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    assert response_data['calories'] == 5
    assert 'created_at' in response_data
    assert 'updated_at' in response_data


def test_create_exercise_missing_name(client, headers):
    data = {
        'description': 'Classic push-up exercise for upper body strength',
        'youtube': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'calories': 5
    }
    
    response = client.post('/exercises/', json=data, headers=headers)
    
    assert response.status_code == 400
    assert response.json['message'] == 'name is required'


def test_create_exercise_empty_name(client, headers):
    data = {
        'name': '',
        'description': 'Classic push-up exercise for upper body strength',
        'youtube': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'calories': 5
    }
    
    response = client.post('/exercises/', json=data, headers=headers)
    
    assert response.status_code == 400
    assert response.json['message'] == 'name is required'


def test_create_exercise_missing_description(client, headers):
    data = {
        'name': 'Push-ups',
        'youtube': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'calories': 5
    }
    
    response = client.post('/exercises/', json=data, headers=headers)
    
    assert response.status_code == 400
    assert response.json['message'] == 'description is required'


def test_create_exercise_empty_description(client, headers):
    data = {
        'name': 'Push-ups',
        'description': '',
        'youtube': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'calories': 5
    }
    
    response = client.post('/exercises/', json=data, headers=headers)
    
    assert response.status_code == 400
    assert response.json['message'] == 'description is required'


def test_create_exercise_missing_youtube(client, headers):
    data = {
        'name': 'Push-ups',
        'description': 'Classic push-up exercise for upper body strength',
        'calories': 5
    }
    
    response = client.post('/exercises/', json=data, headers=headers)
    
    assert response.status_code == 400
    assert response.json['message'] == 'youtube is required'


def test_create_exercise_empty_youtube(client, headers):
    data = {
        'name': 'Push-ups',
        'description': 'Classic push-up exercise for upper body strength',
        'youtube': '',
        'calories': 5
    }
    
    response = client.post('/exercises/', json=data, headers=headers)
    
    assert response.status_code == 400
    assert response.json['message'] == 'youtube is required'


def test_create_exercise_missing_calories(client, headers):
    data = {
        'name': 'Push-ups',
        'description': 'Classic push-up exercise for upper body strength',
        'youtube': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }
    
    response = client.post('/exercises/', json=data, headers=headers)
    
    assert response.status_code == 400
    assert response.json['message'] == 'calories is required'


def test_create_exercise_invalid_youtube_url(client, headers):
    data = {
        'name': 'Push-ups',
        'description': 'Classic push-up exercise for upper body strength',
        'youtube': 'https://invalid-url.com/watch?v=dQw4w9WgXcQ',
        'calories': 5
    }
    
    response = client.post('/exercises/', json=data, headers=headers)
    
    assert response.status_code == 400
    assert response.json['message'] == 'youtube must be a valid YouTube URL'


def test_create_exercise_invalid_youtube_url_format(client, headers):
    data = {
        'name': 'Push-ups',
        'description': 'Classic push-up exercise for upper body strength',
        'youtube': 'https://youtube.com/invalid-format',
        'calories': 5
    }
    
    response = client.post('/exercises/', json=data, headers=headers)
    
    assert response.status_code == 400
    assert response.json['message'] == 'youtube must be a valid YouTube URL'


def test_create_exercise_zero_calories(client, headers):
    data = {
        'name': 'Push-ups',
        'description': 'Classic push-up exercise for upper body strength',
        'youtube': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'calories': 0
    }
    
    response = client.post('/exercises/', json=data, headers=headers)
    
    assert response.status_code == 400
    assert response.json['message'] == 'calories must be a positive integer'


def test_create_exercise_negative_calories(client, headers):
    data = {
        'name': 'Push-ups',
        'description': 'Classic push-up exercise for upper body strength',
        'youtube': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'calories': -5
    }
    
    response = client.post('/exercises/', json=data, headers=headers)
    
    assert response.status_code == 400
    assert response.json['message'] == 'calories must be a positive integer'


def test_create_exercise_string_calories(client, headers):
    data = {
        'name': 'Push-ups',
        'description': 'Classic push-up exercise for upper body strength',
        'youtube': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'calories': 'invalid'
    }
    
    response = client.post('/exercises/', json=data, headers=headers)
    
    assert response.status_code == 400
    assert response.json['message'] == 'calories must be a positive integer'


def test_create_exercise_float_calories(client, headers):
    data = {
        'name': 'Push-ups',
        'description': 'Classic push-up exercise for upper body strength',
        'youtube': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'calories': 5.5
    }
    
    response = client.post('/exercises/', json=data, headers=headers)
    
    assert response.status_code == 400
    assert response.json['message'] == 'calories must be a positive integer'


def test_create_exercise_with_whitespace(client, headers):
    data = {
        'name': '  Push-ups  ',
        'description': '  Classic push-up exercise for upper body strength  ',
        'youtube': '  https://www.youtube.com/watch?v=dQw4w9WgXcQ  ',
        'calories': 5
    }
    
    response = client.post('/exercises/', json=data, headers=headers)
    
    assert response.status_code == 201
    response_data = response.json
    
    assert response_data['name'] == 'Push-ups'
    assert response_data['description'] == 'Classic push-up exercise for upper body strength'
    assert response_data['youtube'] == 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'


def test_create_multiple_exercises(client, headers):
    exercises_data = [
        {
            'name': 'Push-ups',
            'description': 'Classic push-up exercise',
            'youtube': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'calories': 5
        },
        {
            'name': 'Squats',
            'description': 'Lower body strength exercise',
            'youtube': 'https://www.youtube.com/watch?v=aclHkVaku9U',
            'calories': 8
        }
    ]
    
    for exercise_data in exercises_data:
        response = client.post('/exercises/', json=exercise_data, headers=headers)
        assert response.status_code == 201
        
        response_data = response.json
        assert response_data['name'] == exercise_data['name']
        assert response_data['description'] == exercise_data['description']
        assert response_data['youtube'] == exercise_data['youtube']
        assert response_data['calories'] == exercise_data['calories'] 


def test_get_exercises_paginated(client, headers):
    for i in range(15):
        data = {
            'name': f'Exercise {i}',
            'description': f'Description {i}',
            'youtube': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'calories': 10 + i
        }
        client.post('/exercises/', json=data, headers=headers)

    response = client.get('/exercises?page=1&per_page=10', headers=headers)
    assert response.status_code == 200
    data = response.json
    assert 'exercises' in data
    assert 'page' in data
    assert 'per_page' in data
    assert 'total' in data
    assert 'total_pages' in data
    assert data['page'] == 1
    assert data['per_page'] == 10
    assert data['total'] >= 15
    assert data['total_pages'] >= 2
    assert len(data['exercises']) == 10
    for exercise in data['exercises']:
        assert 'id' in exercise
        assert 'name' in exercise
        assert 'description' in exercise
        assert 'calories' in exercise
        assert 'youtube' in exercise 


def test_get_exercise_by_id(client, headers):
    data = {
        'name': 'Burpees',
        'description': 'Full body exercise',
        'youtube': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'calories': 15
    }
    response = client.post('/exercises/', json=data, headers=headers)
    assert response.status_code == 201
    exercise_id = response.json['id']
    assert isinstance(exercise_id, int)

    response = client.get(f'/exercises/{exercise_id}', headers=headers)
    assert response.status_code == 200
    exercise = response.json
    assert exercise['id'] == exercise_id
    assert exercise['name'] == 'Burpees'
    assert exercise['description'] == 'Full body exercise'
    assert exercise['youtube'] == 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    assert exercise['calories'] == 15

    response = client.get('/exercises/999999', headers=headers)
    assert response.status_code == 404
    assert response.json['message'] == 'exercise not found'

def test_update_exercise(client, headers):
    data = {
        'name': 'Jumping Jacks',
        'description': 'Aerobic exercise',
        'youtube': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'calories': 8
    }
    response = client.post('/exercises/', json=data, headers=headers)
    assert response.status_code == 201
    exercise_id = response.json['id']
    assert isinstance(exercise_id, int)

    update_data = {
        'name': 'Jumping Jacks Updated',
        'description': 'Aerobic exercise updated',
        'youtube': 'https://www.youtube.com/watch?v=aclHkVaku9U',
        'calories': 12
    }
    response = client.put(f'/exercises/{exercise_id}', json=update_data, headers=headers)
    assert response.status_code == 200
    updated = response.json
    assert updated['id'] == exercise_id
    assert updated['name'] == 'Jumping Jacks Updated'
    assert updated['description'] == 'Aerobic exercise updated'
    assert updated['youtube'] == 'https://www.youtube.com/watch?v=aclHkVaku9U'
    assert updated['calories'] == 12

    response = client.put('/exercises/999999', json=update_data, headers=headers)
    assert response.status_code == 404
    assert response.json['message'] == 'exercise not found'

def test_update_exercise_validation_errors(client, headers):
    data = {
        'name': 'Test',
        'description': 'Desc',
        'youtube': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'calories': 10
    }
    response = client.post('/exercises/', json=data, headers=headers)
    exercise_id = response.json['id']

    update = data.copy(); update['name'] = ''
    r = client.put(f'/exercises/{exercise_id}', json=update, headers=headers)
    assert r.status_code == 400
    assert r.json['message'] == 'name is required'

    update = data.copy(); update['description'] = ''
    r = client.put(f'/exercises/{exercise_id}', json=update, headers=headers)
    assert r.status_code == 400
    assert r.json['message'] == 'description is required'

    update = data.copy(); update['youtube'] = ''
    r = client.put(f'/exercises/{exercise_id}', json=update, headers=headers)
    assert r.status_code == 400
    assert r.json['message'] == 'youtube is required'

    update = data.copy(); update.pop('calories')
    r = client.put(f'/exercises/{exercise_id}', json=update, headers=headers)
    assert r.status_code == 400
    assert r.json['message'] == 'calories is required'

    update = data.copy(); update['calories'] = 0
    r = client.put(f'/exercises/{exercise_id}', json=update, headers=headers)
    assert r.status_code == 400
    assert r.json['message'] == 'calories must be a positive integer'

    update = data.copy(); update['youtube'] = 'https://invalid.com'
    r = client.put(f'/exercises/{exercise_id}', json=update, headers=headers)
    assert r.status_code == 400
    assert r.json['message'] == 'youtube must be a valid YouTube URL'

def test_update_exercise_internal_error(monkeypatch, client, headers):

    data = {
        'name': 'Test',
        'description': 'Desc',
        'youtube': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'calories': 10
    }
    response = client.post('/exercises/', json=data, headers=headers)
    exercise_id = response.json['id']

    def fake_update(*a, **kw): return 'simulated error'
    from exercises_ms.api import exercises as exercises_module
    monkeypatch.setattr(exercises_module.exercise_repository, 'update_exercise', fake_update)
    r = client.put(f'/exercises/{exercise_id}', json=data, headers=headers)
    assert r.status_code == 500
    assert r.json['message'] == 'error updating exercise'

def test_delete_exercise(client, headers):
    data = {
        'name': 'Plank',
        'description': 'Core exercise',
        'youtube': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'calories': 6
    }
    response = client.post('/exercises/', json=data, headers=headers)
    assert response.status_code == 201
    exercise_id = response.json['id']
    assert isinstance(exercise_id, int)

    response = client.delete(f'/exercises/{exercise_id}', headers=headers)
    assert response.status_code == 200
    assert response.json['message'] == 'exercise deleted'

    response = client.delete('/exercises/999999', headers=headers)
    assert response.status_code == 404
    assert response.json['message'] == 'exercise not found' 

def test_delete_exercise_internal_error(monkeypatch, client, headers):
    data = {
        'name': 'Test',
        'description': 'Desc',
        'youtube': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'calories': 10
    }
    response = client.post('/exercises/', json=data, headers=headers)
    exercise_id = response.json['id']

    def fake_delete(*a, **kw): return 'simulated error'
    from exercises_ms.api import exercises as exercises_module
    monkeypatch.setattr(exercises_module.exercise_repository, 'delete_exercise', fake_delete)
    r = client.delete(f'/exercises/{exercise_id}', headers=headers)
    assert r.status_code == 500
    assert r.json['message'] == 'error deleting exercise' 