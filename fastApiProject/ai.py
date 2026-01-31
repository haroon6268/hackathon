from dotenv import load_dotenv
load_dotenv()
import os
from openai import OpenAI
from schemas import RecipeRequest, Recipe

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def extract_recipe_request(message: str) -> RecipeRequest:
    prompt = f"""
Extract the user's food request into JSON.

Rules:
- Return ONLY valid JSON
- Use null if unknown
- flavor_profile must be an array
- servings must be an integer

Schema:
{{
  "title": string | null,
  "spice_level": "mild" | "medium" | "hot" | null,
  "flavor_profile": string[],
  "servings": number,
  "dietary_restrictions": string[] | null
}}

User input:
"{message}"
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    return RecipeRequest.model_validate_json(
        response.choices[0].message.content
    )
def generate_recipe(req: RecipeRequest) -> Recipe:
    prompt = f"""
You are a backend API that returns JSON ONLY.

Generate ONE cooking recipe that matches ALL constraints.

Constraints:
- Title hint: {req.title}
- Spice level: {req.spice_level}
- Flavor profile: {", ".join(req.flavor_profile)}
- Servings: {req.servings}
- Dietary restrictions: {req.dietary_restrictions}

STRICT RULES:
- Output MUST be valid JSON
- Output MUST match the schema EXACTLY
- Ingredients.quantity MUST be a number (float)
- Calories and protein are TOTAL for the entire recipe
- Do NOT add fields
- Do NOT add comments
- Do NOT add units inside quantity
- Do NOT explain anything

Schema (this is the ONLY allowed structure):

{{
  "title": string,
  "description": string,
  "ingredients": [
    {{
      "name": string,
      "quantity": number,
      "unit": string
    }}
  ],
  "steps": string[],
  "servings": number,
  "calories": number,
  "protein": number,
  "flavor_profile": string[]
}}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.6
    )

    return Recipe.model_validate_json(
        response.choices[0].message.content
    )
