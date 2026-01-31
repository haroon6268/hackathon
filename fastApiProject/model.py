from sqlalchemy import Column, Integer, String, Boolean, Double, ForeignKey, Date, JSON
from sqlalchemy.orm import relationship
from database import Base
from enum import Enum


class User(Base):
    __tablename__ = "users"

    id = Column(String(100), primary_key=True, index=True)
    email = Column(String(100), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)

    recipes = relationship(
        "Recipe", back_populates="user", cascade="all, delete-orphan", lazy="selectin"
    )


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    macros = Column(JSON, nullable=False)
    steps = Column(JSON, nullable=False)

    user_id = Column(String(100), ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="recipes")

    ingredients = relationship(
        "Ingredient",
        back_populates="recipe",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit = Column(String(100), nullable=False)

    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    recipe = relationship("Recipe", back_populates="ingredients")
