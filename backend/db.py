from environment import MONGO_CONSTR, MONGO_DB, MONGO_COLLECTION
import pymongo

class MongoController:
    def __init__(self) -> None:
        self.client = pymongo.MongoClient(MONGO_CONSTR)
        self.db = self.client[MONGO_DB]
        self.collection = self.db[MONGO_COLLECTION]

    def select_all(self) -> tuple[list[str], list[list]]:
        json_data: list[dict] = list(self.collection.find({}, {"_id": 0}))
        if len(json_data) == 0:
            return [], []
        
        table_columns: list[str] = list(json_data[0].keys())
        table_data: list = [list(row.values()) for row in json_data]
        return table_columns, table_data

mongoDB = MongoController()
print(mongoDB.select_all())
