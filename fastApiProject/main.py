import base64
import os
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Request, Depends
from recipe import Recipe
from database import engine
import model
from sqlalchemy import inspect
from typing import Annotated
from database import get_db, Session

app = FastAPI()
load_dotenv()
import json
from openai import AsyncOpenAI


open_ai_key = os.getenv("OPENAI_API_KEY")
client = AsyncOpenAI(api_key=open_ai_key)


def create_tables():
    model.Base.metadata.create_all(bind=engine)


def drop_tables():
    model.Base.metadata.drop_all(bind=engine)


def reset_db():
    drop_tables()
    create_tables()


# reset_db()
inspector = inspect(engine)
tables = inspector.get_table_names()
if not tables:
    create_tables()


@app.post("/")
async def root(file: UploadFile = File(...)):
    contents = await file.read()
    base64_image = base64.b64encode(contents).decode("utf-8")
    # base64_image = base64.b64encode(image_file.read()).decode("utf-8")
    response = await client.responses.create(
        model="gpt-4.1",
        input=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": (
                            "List the ingredients visible in this image, then create a recipe "
                            "using ONLY those ingredients.\n\n"
                            "Return ONLY valid JSON in this exact format. "
                            "The category must be one of: pizza, pasta, salad, burger, sushi, tacos, other.\n"
                            "{\n"
                            '  "title": "string",\n'
                            '  "ingredients": [\n'
                            '    { "name": "string", "quantity": 0, "unit": "string" }\n'
                            "  ],\n"
                            '  "macros": { "protein": 0, "fat": 0, "carbs": 0 },\n'
                            '  "steps": ["string"],\n'
                            '  "category": "string"\n'
                            "}"
                        ),
                    },
                    {
                        "type": "input_image",
                        "image_url": f"data:image/jpeg;base64,{base64_image}",
                    },
                ],
            }
        ],
    )

    raw = response.output[0].content[0].text

    clean = raw.strip()

    if clean.startswith("```"):
        clean = clean.strip("`")
        clean = clean.replace("json", "", 1).strip()

    first_brace = clean.find("{")
    if first_brace > 0:
        clean = clean[first_brace:]

    last_brace = clean.rfind("}")
    if last_brace > 0:
        clean = clean[: last_brace + 1]

    data = json.loads(clean)

    recipe = Recipe(**data)

    return recipe


@app.post("/track_meal")
async def log_meal(file: UploadFile = File(...)):
    contents = await file.read()
    base64_image = base64.b64encode(contents).decode("utf-8")
    response = await client.responses.create(
        model="gpt-4.1",
        input=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": (
                            "Identify the meal in this image "
                            "and predict the macros / micros within the meal\n\n"
                            "Return ONLY valid JSON in this exact format. "
                            "{\n"
                            '  "title": "string",\n'
                            '  "ingredients": [\n'
                            '    { "name": "string", "quantity": 0, "unit": "string" }\n'
                            "  ],\n"
                            '  "calories": 0,\n'
                            '  "ingredients": ["string"],\n'
                            '  "category": "string"\n'
                            "}"
                        ),
                    },
                    {
                        "type": "input_image",
                        "image_url": f"data:image/jpeg;base64,{base64_image}",
                    },
                ],
            }
        ],
    )

    raw = response.output[0].content[0].text

    clean = raw.strip()

    if clean.startswith("```"):
        clean = clean.strip("`")
        clean = clean.replace("json", "", 1).strip()

    first_brace = clean.find("{")
    if first_brace > 0:
        clean = clean[first_brace:]

    last_brace = clean.rfind("}")
    if last_brace > 0:
        clean = clean[: last_brace + 1]

    data = json.loads(clean)

    recipe = Recipe(**data)

    return recipe


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


@app.post("/recipe/save")
async def save_recipe(
    user_id: str, recipe: Recipe, db: Annotated[Session, Depends(get_db)]
):
    db_recipe = model.Recipe(
        **recipe.dict(include={"title", "macros", "steps", "category"})
    )
    db_recipe.user_id = user_id
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    for i in recipe.ingredients:
        db_ing = model.Ingredient(
            name=i.name, quantity=i.quantity, unit=i.unit, recipe_id=db_recipe.id
        )
        db.add(db_ing)

    db.commit()
    db.refresh(db_recipe)


@app.get("/user_recipe")
async def get_user_recipe(user_id: str, db: Annotated[Session, Depends(get_db)]):
    allRecipes = db.query(model.Recipe).filter(model.Recipe.user_id == user_id).all()
    return allRecipes


@app.get("/recipe/{id}")
async def get_recipe_by_id(id: int, db: Annotated[Session, Depends(get_db)]):
    recipe = db.query(model.Recipe).filter(model.Recipe.id == id).first()
    return recipe


@app.get("/global_recipe")
async def get_all_recipe(
    db: Annotated[Session, Depends(get_db)], limit=20, category: str = None
):
    if category is None:
        allRecipes = db.query(model.Recipe).limit(limit).all()
    else:
        allRecipes = (
            db.query(model.Recipe)
            .filter(model.Recipe.category == category)
            .limit(limit)
            .all()
        )
    return allRecipes


@app.post("/user")
async def clerk_webhook(request: Request, db: Annotated[Session, Depends(get_db)]):
    payload = await request.body()

    data = json.loads(payload)

    user_data = data["data"]

    user_id = user_data["id"]
    first_name = user_data.get("first_name")
    last_name = user_data.get("last_name")
    email = user_data["email_addresses"][0]["email_address"]

    new_user = model.User(
        id=user_id, email=email, first_name=first_name, last_name=last_name
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
