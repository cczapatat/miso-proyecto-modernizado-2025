import uuid
import re
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID

from ..config.db import db


class Exercise(db.Model):
    __tablename__ = 'exercises'
    __table_args__ = (
        CheckConstraint(
            "calories > 0",
            name='positive_calories'
        ),
        CheckConstraint(
            "youtube ~* '^https://(www\\.)?youtube\\.com/watch\\?v=[a-zA-Z0-9_-]+$'",
            name='valid_youtube_url_format'
        ),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=False)
    youtube = Column(String(500), nullable=False)
    calories = Column(Integer, nullable=False)
    created_at = Column(DateTime(), default=datetime.now)
    updated_at = Column(DateTime(), default=datetime.now)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'youtube': self.youtube,
            'calories': self.calories,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        } 