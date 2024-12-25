import json
from pprint import pprint
from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn


app = FastAPI()


class Health(BaseModel):
    health: str

def sort_data(data):
    if '0' in data.keys():
        name = data['0']['name']
        data_raw = [data[i]['data'] for i in data.keys()]
        pprint(name)
        pprint(data_raw)
    elif 'name' in data.keys():
        name = "hr"
        data = data['data']
        pprint(data)

def to_db(data):
    pass

@app.get("/")
def read_root():
    return {"Hello": "World4"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.post("/health")
def read_health_data(health: Health):
    data = json.loads(health.health)
    sort_data(data)
    # pprint(data)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
