from pydantic import BaseModel
from typing import List, Dict
from typing import Optional


class Ingredients(BaseModel):
    name: str
    quantity: float
    unit: str


class Recipe(BaseModel):
    title: str
    ingredients: List[Ingredients]
    macros: Dict[str, float]
    steps: List[str]
    category: str
