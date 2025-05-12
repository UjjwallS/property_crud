import json
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

json_files = [
    "data/builders_project_info_batch_1.json",
    "data/builders_project_info_batch_2.json",
    "data/builders_project_info_batch_3.json",
    "data/builders_project_info_batch_4.json"
]

# In-memory storage
properties = []

def load_data():
    global properties
    properties = []
    for file in json_files:
        if os.path.exists(file):
            try:
                with open(file, "r", encoding="utf-8") as f:
                    properties.extend(json.load(f))
            except Exception as e:
                print(f"Error reading {file}: {e}")

load_data()

class Project(BaseModel):
    project_name: str
    location: str
    description: str = ""
    other_info: dict = {}

class Property(BaseModel):
    builder: str
    website: str
    data: List[Project]

@app.get("/properties")
async def get_properties():
    return properties

@app.post("/properties")
async def create_property(property: Property):
    properties.append(property.dict())
    return {"message": "Property added successfully."}

@app.put("/properties/{property_id}")
async def update_property(property_id: int, property: Property):
    if property_id < 0 or property_id >= len(properties):
        raise HTTPException(status_code=404, detail="Property not found")
    properties[property_id] = property.dict()
    return {"message": "Property updated successfully."}

@app.delete("/properties/{property_id}")
async def delete_property(property_id: int):
    if property_id < 0 or property_id >= len(properties):
        raise HTTPException(status_code=404, detail="Property not found")
    properties.pop(property_id)
    return {"message": "Property deleted successfully."}
