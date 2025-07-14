from datetime import datetime
from sqlalchemy.exc import IntegrityError
from flask import jsonify, make_response

from ..config.db import db
from ..models.user_model import User
from ..dtos.user_dto import UserDTO


class UserRepository:

    @staticmethod
    def create_user(user_dto: UserDTO) -> User:
        user = User()
        user.name = user_dto.name
        user.last_name = user_dto.last_name
        user.age = user_dto.age
        user.height = user_dto.height
        user.weight = user_dto.weight
        user.arm = user_dto.arm
        user.chest = user_dto.chest
        user.waist = user_dto.waist
        user.leg = user_dto.leg
        user.withdrawal_date = user_dto.withdrawal_date
        user.withdrawal_reason = user_dto.withdrawal_reason
        user.created_at = datetime.now()
        user.updated_at = datetime.now()

        try:
            db.session.add(user)
            db.session.commit()
        except IntegrityError as e:
            db.session.rollback()
            return make_response(
                jsonify({"error": "Integrity error", "message": str(e.orig)}), 400
            )
        except Exception as e:
            db.session.rollback()
            return make_response(
                jsonify({"error": "Internal server error", "message": str(e)}), 500
            )

        return user

    @staticmethod
    def get_all_users():
        users = User.query.order_by(User.created_at.desc()).all()
        return [user.to_dict() for user in users]

    @staticmethod
    def get_user_by_id(user_id):
        return User.query.get(user_id)

    @staticmethod
    def update_user(user_id, user_dto: UserDTO):
        user = User.query.get(user_id)
        if not user:
            return None

        user.name = user_dto.name
        user.last_name = user_dto.last_name
        user.age = user_dto.age
        user.height = user_dto.height
        user.weight = user_dto.weight
        user.arm = user_dto.arm
        user.chest = user_dto.chest
        user.waist = user_dto.waist
        user.leg = user_dto.leg
        user.withdrawal_date = user_dto.withdrawal_date
        user.withdrawal_reason = user_dto.withdrawal_reason
        user.updated_at = datetime.now()

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return str(e)

        return user

    @staticmethod
    def delete_user(user_id):
        user = User.query.get(user_id)
        if not user:
            return None

        try:
            db.session.delete(user)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return str(e)

        return True
