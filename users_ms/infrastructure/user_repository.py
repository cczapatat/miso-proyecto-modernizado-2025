from datetime import datetime
from sqlalchemy.exc import IntegrityError
from flask import request

from ..config.db import db
from ..models.user_model import User
from ..dtos.user_dto import UserDTO


class RepositoryError(Exception):
    """Excepción base para errores del repositorio."""
    def __init__(self, message, status_code=500):
        super().__init__(message)
        self.status_code = status_code

class UserNotFoundError(RepositoryError):
    """Lanzada cuando un usuario no se encuentra."""
    def __init__(self, message="user not found"):
        super().__init__(message, 404)

class UserIntegrityError(RepositoryError):
    """Lanzada por errores de integridad de datos (ej. duplicados)."""
    def __init__(self, message="Data integrity error"):
        super().__init__(message, 400)


class UserRepository:

    @staticmethod
    def create_user(user_dto: UserDTO) -> User:
        user = User(
            name=user_dto.name,
            last_name=user_dto.last_name,
            age=user_dto.age,
            height=user_dto.height,
            weight=user_dto.weight,
            arm=user_dto.arm,
            chest=user_dto.chest,
            waist=user_dto.waist,
            leg=user_dto.leg,
            withdrawal_date=user_dto.withdrawal_date,
            withdrawal_reason=user_dto.withdrawal_reason
        )

        try:
            db.session.add(user)
            db.session.commit()
            return user
        except IntegrityError as e:
            db.session.rollback()
            raise UserIntegrityError(str(e.orig))
        except Exception as e:
            db.session.rollback()
            raise RepositoryError(str(e))

    @staticmethod
    def get_all_users(page=None, per_page=None):
        """
        Obtiene usuarios. Si se proveen 'page' y 'per_page', devuelve un resultado paginado.
        De lo contrario, devuelve todos los usuarios.
        """
        query = db.session.query(User).order_by(User.created_at.desc())

        if page and per_page:
            pagination = query.paginate(page=page, per_page=per_page, error_out=False)
            return {
                "users": [user.to_dict() for user in pagination.items],
                "total": pagination.total,
                "pages": pagination.pages,
                "page": pagination.page,
                "per_page": pagination.per_page,
                "has_next": pagination.has_next,
                "has_prev": pagination.has_prev
            }
        else:
            users = query.all()
            return [user.to_dict() for user in users]

    @staticmethod
    def get_user_by_id(user_id):
        return db.session.get(User, user_id)

    @staticmethod
    def update_user(user_id, user_dto: UserDTO):
        user = db.session.get(User, user_id)
        if not user:
            raise UserNotFoundError()

        user.name = user_dto.name
        user.last_name = user_dto.last_name
        user.age = user_dto.age
        user.height=user_dto.height
        user.weight=user_dto.weight
        user.arm=user_dto.arm
        user.chest=user_dto.chest
        user.waist=user_dto.waist
        user.leg=user_dto.leg
        user.updated_at = datetime.now()

        try:
            db.session.commit()
            return user
        except Exception as e:
            db.session.rollback()
            raise RepositoryError(str(e))

    @staticmethod
    def delete_user(user_id):
        user = db.session.get(User, user_id)
        if not user:
            raise UserNotFoundError()

        try:
            db.session.delete(user)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise RepositoryError(str(e))