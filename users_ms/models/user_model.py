from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, CheckConstraint
from ..config.db import db

class User(db.Model):
    __tablename__ = 'users'
    __table_args__ = (
        CheckConstraint('age > 0', name='positive_age'),
        CheckConstraint('height > 0', name='positive_height'),
        CheckConstraint('weight > 0', name='positive_weight'),
        CheckConstraint('arm >= 0', name='non_negative_arm'),
        CheckConstraint('chest >= 0', name='non_negative_chest'),
        CheckConstraint('waist >= 0', name='non_negative_waist'),
        CheckConstraint('leg >= 0', name='non_negative_leg'),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    age = Column(Integer, nullable=False)
    height = Column(Float, nullable=False)
    weight = Column(Float, nullable=False)
    arm = Column(Integer, nullable=False)
    chest = Column(Integer, nullable=False)
    waist = Column(Integer, nullable=False)
    leg = Column(Integer, nullable=False)
    withdrawal_date = Column(String(100), nullable=True)
    withdrawal_reason = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'last_name': self.last_name,
            'age': self.age,
            'height': self.height,
            'weight': self.weight,
            'arm': self.arm,
            'chest': self.chest,
            'waist': self.waist,
            'leg': self.leg,
            'withdrawal_date': self.withdrawal_date,
            'withdrawal_reason': self.withdrawal_reason,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
