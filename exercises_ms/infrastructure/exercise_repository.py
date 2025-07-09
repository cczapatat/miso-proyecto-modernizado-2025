from datetime import datetime
from sqlalchemy.exc import IntegrityError
from flask import jsonify, make_response

from ..config.db import db
from ..models.exercise_model import Exercise
from ..dtos.exercise_dto import ExerciseDTO

class ExerciseRepository:

    @staticmethod
    def create_exercise(exercise_dto: ExerciseDTO) -> Exercise:
        exercise = Exercise()
        exercise.name = exercise_dto.name
        exercise.description = exercise_dto.description
        exercise.youtube = exercise_dto.youtube
        exercise.calories = exercise_dto.calories
        exercise.created_at = datetime.now()
        exercise.updated_at = datetime.now()

        try:
            db.session.add(exercise)
            db.session.commit()
        except IntegrityError as e:
            db.session.rollback()
            response = make_response(
                jsonify({"error": "Integrity error", "message": str(e.orig)}), 400
            )
            return response
        except Exception as e:
            db.session.rollback()
            response = make_response(
                jsonify({"error": "Internal server error", "message": str(e)}), 500
            )
            return response

        return exercise 

    @staticmethod
    def get_exercises_paginated(page=1, per_page=10):
        query = Exercise.query.order_by(Exercise.created_at.desc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        exercises = [exercise.to_dict() for exercise in pagination.items]
        return {
            'exercises': exercises,
            'page': pagination.page,
            'per_page': pagination.per_page,
            'total': pagination.total,
            'total_pages': pagination.pages
        } 

    @staticmethod
    def get_exercise_by_id(exercise_id):
        exercise = Exercise.query.get(exercise_id)
        return exercise

    @staticmethod
    def update_exercise(exercise_id, exercise_dto: ExerciseDTO):
        exercise = Exercise.query.get(exercise_id)
        if not exercise:
            return None
        exercise.name = exercise_dto.name
        exercise.description = exercise_dto.description
        exercise.youtube = exercise_dto.youtube
        exercise.calories = exercise_dto.calories
        exercise.updated_at = datetime.now()
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return str(e)
        return exercise

    @staticmethod
    def delete_exercise(exercise_id):
        exercise = Exercise.query.get(exercise_id)
        if not exercise:
            return None
        try:
            db.session.delete(exercise)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return str(e)
        return True 