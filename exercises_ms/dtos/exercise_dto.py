from dataclasses import dataclass, field

@dataclass
class ExerciseDTO:
    name: str = field(default=None)
    description: str = field(default=None)
    youtube: str = field(default=None)
    calories: int = field(default=None) 