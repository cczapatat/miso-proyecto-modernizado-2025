import pytest
from users_ms import create_app
from users_ms.config.db import db as _db # Renombramos para evitar conflictos
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env.test")

@pytest.fixture(scope='session')
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
    })

    with app.app_context():
        yield app

@pytest.fixture(scope='function')
def db(app):
    """
    Fixture para la base de datos que garantiza aislamiento por CADA PRUEBA.
    (scope='function' es el comportamiento por defecto y el ideal aquí).
    """
    with app.app_context():
        _db.create_all()
        yield _db
        _db.session.remove()
        _db.drop_all()


@pytest.fixture
def client(app, db):
    return app.test_client()


@pytest.fixture
def headers():
    return {
        'Content-Type': 'application/json'
    }