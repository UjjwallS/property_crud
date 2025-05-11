import json
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS (so frontend on localhost:3000 can access backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# List of your JSON files
json_files = [
    "data/builders_project_info_batch_1.json",
    "data/builders_project_info_batch_2.json",
    "data/builders_project_info_batch_3.json",
    "data/builders_project_info_batch_4.json"
]

# Function to load data
def load_data():
    properties = []
    for file in json_files:
        if os.path.exists(file):
            try:
                with open(file, "r", encoding="utf-8") as f:
                    properties.extend(json.load(f))
            except Exception as e:
                print(f"Error reading {file}: {e}")
    return properties

@app.get("/properties")
async def get_properties():
    return load_data()
