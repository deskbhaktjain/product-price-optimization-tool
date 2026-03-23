from pymongo import MongoClient
from config import Config

class Database:
    """Database connection management"""
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            cls._instance.client = MongoClient(Config.MONGODB_URI)
            cls._instance.db = cls._instance.client.get_database()
        return cls._instance
    
    @classmethod
    def get_db(cls):
        """Get database instance"""
        instance = cls()
        return instance.db
    
    @classmethod
    def get_client(cls):
        """Get MongoDB client"""
        instance = cls()
        return instance.client
    
    @classmethod
    def close(cls):
        """Close database connection"""
        if cls._instance:
            cls._instance.client.close()

def get_db():
    """Helper function to get database"""
    return Database.get_db()
