from pymongo import MongoClient
from app.config import settings


class MongoDBHandler:
    def __init__(self):
        self.client = MongoClient(settings.MONGODB_URI)
        self.db = self.client[settings.MONGODB_DB]
    
    def get_collection(self, collection_name: str):
        return self.db[collection_name]
    
    def insert_one(self, collection_name: str, data: dict):
        return self.get_collection(collection_name).insert_one(data)
    
    def insert_many(self, collection_name: str, data: list):
        return self.get_collection(collection_name).insert_many(data)
    
    def find_one(self, collection_name: str, query: dict, projection: dict = None):
        return self.get_collection(collection_name).find_one(query, projection)
    
    def find_many(self, collection_name: str, query: dict, projection: dict = None):
        return list(self.get_collection(collection_name).find(query, projection))
    
    def update_one(self, collection_name: str, query: dict, update_data: dict):
        return self.get_collection(collection_name).update_one(query, {'$set': update_data})
    
    def update_many(self, collection_name: str, query: dict, update_data: dict):
        return self.get_collection(collection_name).update_many(query, {'$set': update_data})
    
    def delete_one(self, collection_name: str, query: dict):
        return self.get_collection(collection_name).delete_one(query)
    
    def delete_many(self, collection_name: str, query: dict):
        return self.get_collection(collection_name).delete_many(query)
    
    def count_documents(self, collection_name: str, query: dict):
        return self.get_collection(collection_name).count_documents(query)
    
    def aggregate(self, collection_name: str, pipeline: list):
        return list(self.get_collection(collection_name).aggregate(pipeline))
    
    def distinct(self, collection_name: str, field: str, query: dict = None):
        return self.get_collection(collection_name).distinct(field, query or {})
    
    def create_index(self, collection_name: str, keys: list, unique: bool = False):
        return self.get_collection(collection_name).create_index(keys, unique=unique)
    
    def drop_index(self, collection_name: str, index_name: str):
        return self.get_collection(collection_name).drop_index(index_name)
    
    def list_indexes(self, collection_name: str):
        return list(self.get_collection(collection_name).list_indexes())
    
    def list_collections(self):
        return self.db.list_collection_names()
    
    def drop_collection(self, collection_name: str):
        return self.db.drop_collection(collection_name)
    
    def close_connection(self):
        self.client.close()

# Example usage
# mongo_handler = MongoDBHandler("mongodb://localhost:27017", "testdb")
# mongo_handler.insert_one("users", {"name": "John", "age": 30})
