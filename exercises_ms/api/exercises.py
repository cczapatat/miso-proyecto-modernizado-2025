import re
from flask import Blueprint, jsonify, request
from werkzeug.exceptions import Unauthorized

from ..dtos.exercise_dto import ExerciseDTO
from ..infrastructure.exercise_repository import ExerciseRepository
from ..models.exercise_model import Exercise

bp = Blueprint('exercises', __name__, url_prefix='/exercises')

exercise_repository = ExerciseRepository()


def validate_youtube_url(url):
    pattern = r'^https://(www\.)?youtube\.com/watch\?v=[a-zA-Z0-9_-]+$'
    return re.match(pattern, url) is not None


def validate_positive_integer(value):
    try:
        if isinstance(value, float) and value != int(value):
            return False
        int_value = int(value)
        return int_value > 0
    except (ValueError, TypeError):
        return False


@bp.route('/', methods=('POST',))
def create_exercise():
    data = request.get_json()
    
    name = data.get('name')
    if name is None or not name.strip():
        return jsonify({'message': 'name is required'}), 400
    
    description = data.get('description')
    if description is None or not description.strip():
        return jsonify({'message': 'description is required'}), 400
    
    youtube = data.get('youtube')
    if youtube is None or not youtube.strip():
        return jsonify({'message': 'youtube is required'}), 400
    
    calories = data.get('calories')
    if calories is None:
        return jsonify({'message': 'calories is required'}), 400
    
    if not validate_positive_integer(calories):
        return jsonify({'message': 'calories must be a positive integer'}), 400
    
    name = name.strip()
    description = description.strip()
    youtube = youtube.strip()
    
    if not validate_youtube_url(youtube):
        return jsonify({'message': 'youtube must be a valid YouTube URL'}), 400
    
    exercise_dto = ExerciseDTO(
        name=name,
        description=description,
        youtube=youtube,
        calories=int(calories)
    )
    
    create_exercise_response = exercise_repository.create_exercise(exercise_dto=exercise_dto)
    
    if isinstance(create_exercise_response, Exercise):
        exercise_dict = create_exercise_response.to_dict()
        return jsonify(exercise_dict), 201
    else:
        return create_exercise_response 


@bp.route('/', methods=('GET',), strict_slashes=False)
def get_exercises():
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)
    result = exercise_repository.get_exercises_paginated(page=page, per_page=per_page)
    return jsonify(result), 200 


@bp.route('/<exercise_id>', methods=('GET',))
def get_exercise_by_id(exercise_id):
    exercise = exercise_repository.get_exercise_by_id(exercise_id)
    if not exercise:
        return jsonify({'message': 'exercise not found'}), 404
    return jsonify(exercise.to_dict()), 200

@bp.route('/<exercise_id>', methods=('PUT',))
def update_exercise(exercise_id):
    data = request.get_json()
    name = data.get('name')
    if name is None or not name.strip():
        return jsonify({'message': 'name is required'}), 400
    description = data.get('description')
    if description is None or not description.strip():
        return jsonify({'message': 'description is required'}), 400
    youtube = data.get('youtube')
    if youtube is None or not youtube.strip():
        return jsonify({'message': 'youtube is required'}), 400
    calories = data.get('calories')
    if calories is None:
        return jsonify({'message': 'calories is required'}), 400
    if not validate_positive_integer(calories):
        return jsonify({'message': 'calories must be a positive integer'}), 400
    name = name.strip()
    description = description.strip()
    youtube = youtube.strip()
    if not validate_youtube_url(youtube):
        return jsonify({'message': 'youtube must be a valid YouTube URL'}), 400
    exercise_dto = ExerciseDTO(
        name=name,
        description=description,
        youtube=youtube,
        calories=int(calories)
    )
    updated = exercise_repository.update_exercise(exercise_id, exercise_dto)
    if updated is None:
        return jsonify({'message': 'exercise not found'}), 404
    elif isinstance(updated, str):
        return jsonify({'message': 'error updating exercise', 'error': updated}), 500
    return jsonify(updated.to_dict()), 200

@bp.route('/<exercise_id>', methods=('DELETE',))
def delete_exercise(exercise_id):
    deleted = exercise_repository.delete_exercise(exercise_id)
    if deleted is None:
        return jsonify({'message': 'exercise not found'}), 404
    elif isinstance(deleted, str):
        return jsonify({'message': 'error deleting exercise', 'error': deleted}), 500
    return jsonify({'message': 'exercise deleted'}), 200 