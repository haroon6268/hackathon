import base64
import os

from fastapi import FastAPI

app = FastAPI()


from openai import AsyncOpenAI

open_ai_key = os.getenv("open_ai_key")
client = AsyncOpenAI(api_key=open_ai_key)





@app.get("/")
async def root():
    with open("test.jpg", "rb") as image_file:
        base64_image = base64.b64encode(image_file.read()).decode("utf-8")
        response = await client.responses.create(
            model="gpt-4.1",
            input=[
                {
                    "role": "user",
                    "content": [
                        {"type": "input_text", "text": "List out the ingredients in this image, then give me a recipe based on the ingredients in this image."},
                        {
                            "type": "input_image",
                            "image_url": f"data:image/jpeg;base64,{base64_image}",
                        },
                    ],
                }
            ],
        )
    return {"message": response.output_text}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
