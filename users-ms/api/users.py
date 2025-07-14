from flask import Blueprint, jsonify, request
from ..dtos.user_dto import UserDTO
from ..infrastructure.user_repository import UserRepository
from ..models.user_model import User
from datetime import datetime
from ..config.db import db


bp = Blueprint('users', __name__, url_prefix='/users')
user_repository = UserRepository()

def validate_positive_number(value):
    try:
        float_value = float(value)
        return float_value > 0
    except (ValueError, TypeError):
        return False

@bp.route('/', methods=('POST',))
def create_user():
    data = request.get_json()

    required_fields = ['name', 'last_name', 'age', 'height', 'weight', 'arm', 'chest', 'waist', 'leg']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'message': f'{field} is required'}), 400

    if not data['age'].isdigit() or int(data['age']) <= 0:
        return jsonify({'message': 'age must be a positive integer'}), 400

    numeric_fields = ['height', 'weight', 'arm', 'chest', 'waist', 'leg']
    for field in numeric_fields:
        if not validate_positive_number(data[field]):
            return jsonify({'message': f'{field} must be a positive number'}), 400

    user_dto = UserDTO(
        name=data['name'].strip(),
        last_name=data['last_name'].strip(),
        age=int(data['age']),
        height=float(data['height']),
        weight=float(data['weight']),
        arm=int(data['arm']),
        chest=int(data['chest']),
        waist=int(data['waist']),
        leg=int(data['leg']),
        withdrawal_date=data.get('withdrawal_date', '').strip(),
        withdrawal_reason=data.get('withdrawal_reason', '').strip()
    )

    created = user_repository.create_user(user_dto)
    if isinstance(created, User):
        return jsonify(created.to_dict()), 201
    return created

@bp.route('/', methods=['GET'])
def get_users():
    return jsonify(user_repository.get_all_users()), 200

@bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = user_repository.get_user_by_id(user_id)
    if not user:
        return jsonify({'message': 'user not found'}), 404
    return jsonify(user.to_dict()), 200

@bp.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    if not user_repository.get_user_by_id(user_id):
        return jsonify({'message': 'user not found'}), 404

    data = request.get_json()

    required_fields = ['name', 'last_name', 'age', 'height', 'weight', 'arm', 'chest', 'waist', 'leg']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'message': f'{field} is required'}), 400

    if not data['age'].isdigit() or int(data['age']) <= 0:
        return jsonify({'message': 'age must be a positive integer'}), 400

    numeric_fields = ['height', 'weight', 'arm', 'chest', 'waist', 'leg']
    for field in numeric_fields:
        if not validate_positive_number(data[field]):
            return jsonify({'message': f'{field} must be a positive number'}), 400

    user_dto = UserDTO(
        name=data['name'].strip(),
        last_name=data['last_name'].strip(),
        age=int(data['age']),
        height=float(data['height']),
        weight=float(data['weight']),
        arm=int(data['arm']),
        chest=int(data['chest']),
        waist=int(data['waist']),
        leg=int(data['leg']),
        withdrawal_date=data.get('withdrawal_date', '').strip(),
        withdrawal_reason=data.get('withdrawal_reason', '').strip()
    )

    updated = user_repository.update_user(user_id, user_dto)
    return jsonify(updated.to_dict()), 200


@bp.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    deleted = user_repository.delete_user(user_id)
    if not deleted:
        return jsonify({'message': 'user not found'}), 404
    return jsonify({'message': 'user deleted'}), 200

@bp.route('/<int:user_id>/withdraw', methods=['PUT'])
def withdraw_user(user_id):
    data = request.get_json()
    withdrawal_date = data.get('withdrawal_date', '').strip()
    withdrawal_reason = data.get('withdrawal_reason', '').strip()

    if not withdrawal_date or not withdrawal_reason:
        return jsonify({'message': 'withdrawal_date and withdrawal_reason are required'}), 400

    user = user_repository.get_user_by_id(user_id)
    if not user:
        return jsonify({'message': 'user not found'}), 404

    if user.withdrawal_date:
        return jsonify({'message': 'user is already withdrawn'}), 400

    user.withdrawal_date = withdrawal_date
    user.withdrawal_reason = withdrawal_reason
    user.updated_at = datetime.now()

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error updating user', 'details': str(e)}), 500

    return jsonify(user.to_dict()), 200


@bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'up'}), 200

