from environment import MONGO_CONSTR, MONGO_DB, MONGO_COLLECTION
import pymongo
from data_manipulator import DataManipulator

class MongoController:
    def __init__(self) -> None:
        self.client = pymongo.MongoClient(MONGO_CONSTR)
        self.db = self.client[MONGO_DB]
        self.collection = self.db[MONGO_COLLECTION]

    def select_all(self) -> tuple[list[str], list[list]]:
        json_data: list[dict] = list(self.collection.find({}, {"_id": 0}))
        return DataManipulator.get_sendable_data(json_data)

mongoDB = MongoController()
print(mongoDB.select_all())
