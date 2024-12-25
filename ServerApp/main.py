from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn


app = FastAPI()


class Health(BaseModel):
    health: str


@app.get("/")
def read_root():
    return {"Hello": "World4"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.post("/health")
def read_health_data(health: Health):
    print("Heart rate:", health.health)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
