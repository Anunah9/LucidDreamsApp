import datetime
import json
from pprint import pprint
import sqlite3
from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn


app = FastAPI()


def to_db():
    pass


def heartrate_handler(data):
    with sqlite3.connect("./db.db") as db:
        cursor = db.cursor()

        data = (data["time"], data["hr"])
        # print(data)
        query = "INSERT INTO heartrate VALUES (?, ?)"
        cursor.execute(query, data)

        db.commit()


def position_handler(name, data_raw):
    with sqlite3.connect("./db.db") as db:
        cursor = db.cursor()
        data = []
        for i in data_raw:
            data.append(tuple(i[1] for i in list(i.items())))
        # print(data)
        if name == "axel":
            query = "INSERT INTO accelerometer VALUES (?, ?, ?, ?)"
            cursor.executemany(query, data)
        elif name == "guro":
            query = "INSERT INTO gyroscope VALUES (?, ?, ?, ?)"
            cursor.executemany(query, data)
        db.commit()


class Health(BaseModel):
    health: str


def sort_data(data):
    if "0" in data.keys():
        name = data["0"]["name"]
        data_raw = [data[i]["data"] for i in data.keys()]
        # pprint(name)
        position_handler(name, data_raw)
        # pprint(data_raw)
    elif "name" in data.keys():
        name = "hr"
        data = data["data"]
        heartrate_handler(data)
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
    print(datetime.time)
    sort_data(data)
    # pprint(data)


if __name__ == "__main__":

    uvicorn.run(app, host="0.0.0.0", port=5000)
