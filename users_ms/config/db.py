import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def init_db(app: Flask) -> SQLAlchemy:
    global db
    db.init_app(app)
    return db


def create_db(app: Flask):
    global db
    init_db(app)

    with app.app_context():
        from ..models import user_model

        db.create_all()


def get_uri_db() -> str:
    host = os.getenv('DB_HOST', default="127.0.0.1")
    port = os.getenv('DB_PORT', default="5432")
    user = os.getenv('DB_USER', default="postgres")
    password = os.getenv('DB_PASSWORD', default="postgres")
    db_name = os.getenv('DB_NAME', default="project_modernization_users")
    db_type = os.getenv('DB_TYPE', default="postgresql")

    return f'{db_type}://{user}:{password}@{host}:{port}/{db_name}' 