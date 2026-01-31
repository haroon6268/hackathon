import base64
import os
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
from recipe import Recipe


app = FastAPI()
load_dotenv()
import json
from openai import AsyncOpenAI


open_ai_key = os.getenv("OPENAI_API_KEY")
client = AsyncOpenAI(api_key=open_ai_key)


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
                            "Return ONLY valid JSON in this format:\n"
                            "{\n"
                            '  "title": "...",\n'
                            '  "ingredients": [\n'
                            '    { "name": "string", "quantity": "float", "unit": "string",}\n'
                            "  ],\n"
                            '  "macros": {"protein": 0, "fat": 0, "carbs": 0},\n'
                            '  "steps": ["..."]\n'
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


# "From the given image create a recipe using the ingredients in the image include the ingredients and macros in the given pydantic model format
@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
