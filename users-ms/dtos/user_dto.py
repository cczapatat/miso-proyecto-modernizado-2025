from dataclasses import dataclass, field

@dataclass
class UserDTO:
    name: str = field(default=None)
    last_name: str = field(default=None)
    age: int = field(default=None)
    height: float = field(default=None)
    weight: float = field(default=None)
    arm: int = field(default=None)
    chest: int = field(default=None)
    waist: int = field(default=None)
    leg: int = field(default=None)
    withdrawal_date: str = field(default=None)
    withdrawal_reason: str = field(default=None)
