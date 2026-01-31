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


class Meals(BaseModel):
    title: str
    calories: int
    carbs: str
    protein: str
    fat: str
    fiber: str
    vitamin_d: str
    vitamin_a: str
    vitamin_c: str
    iron: str
    calcium: str
    magnesium: str
    potassium: str
    zinc: str
    ingredients: List[str]
