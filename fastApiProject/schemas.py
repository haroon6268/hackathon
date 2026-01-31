from pydantic import BaseModel
from typing import Optional, List

class RecipeRequest(BaseModel):
    title: Optional[str]
    spice_level: Optional[str]  # mild, medium, hot
    flavor_profile: List[str]   # sweet, sour, savory, etc.
    servings: int
    dietary_restrictions: Optional[List[str]]

class Ingredients(BaseModel):
    name: str
    quantity: float
    unit: str
class Recipe(BaseModel):
    title: str
    description: str
    ingredients: List[Ingredients];
    steps: List[str]
    servings: int
    calories: float
    protein: float
    flavor_profile: List[str]

class UserInput(BaseModel):
    message: str
    