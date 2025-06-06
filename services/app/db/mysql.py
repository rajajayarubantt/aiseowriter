import pymysql
from app.config import settings

class MySQLHandler:
    def __init__(self):
        self.connection = pymysql.connect(
            host=settings.MYSQL_HOST,
            port=settings.MYSQL_PORT,
            user=settings.MYSQL_USER,
            password=settings.MYSQL_PASSWORD,
            database=settings.MYSQL_DB,
            cursorclass=pymysql.cursors.DictCursor
        )
        self.cursor = self.connection.cursor()
    
    def execute_query(self, query: str, params: tuple = None):
        self.cursor.execute(query, params or ())
        self.connection.commit()
        return self.cursor
    
    def fetch_one(self, query: str, params: tuple = None):
        self.cursor.execute(query, params or ())
        return self.cursor.fetchone()
    
    def fetch_all(self, query: str, params: tuple = None):
        self.cursor.execute(query, params or ())
        return self.cursor.fetchall()
    
    def insert_one(self, table: str, data: dict):
        keys = ', '.join(data.keys())
        values = ', '.join(['%s'] * len(data))
        query = f"INSERT INTO {table} ({keys}) VALUES ({values})"
        self.execute_query(query, tuple(data.values()))
        return self.cursor.lastrowid
    
    def insert_many(self, table: str, data_list: list):
        if not data_list:
            return
        keys = ', '.join(data_list[0].keys())
        values = ', '.join(['%s'] * len(data_list[0]))
        query = f"INSERT INTO {table} ({keys}) VALUES ({values})"
        self.cursor.executemany(query, [tuple(data.values()) for data in data_list])
        self.connection.commit()
    
    def update(self, table: str, data: dict, condition: str, params: tuple):
        set_clause = ', '.join([f"{key} = %s" for key in data.keys()])
        query = f"UPDATE {table} SET {set_clause} WHERE {condition}"
        self.execute_query(query, tuple(data.values()) + params)
    
    def delete(self, table: str, condition: str, params: tuple):
        query = f"DELETE FROM {table} WHERE {condition}"
        self.execute_query(query, params)
    
    def count_rows(self, table: str, condition: str = "1", params: tuple = ()): 
        query = f"SELECT COUNT(*) as count FROM {table} WHERE {condition}"
        return self.fetch_one(query, params)['count']
    
    def create_table(self, table: str, schema: str):
        query = f"CREATE TABLE IF NOT EXISTS {table} ({schema})"
        self.execute_query(query)
    
    def drop_table(self, table: str):
        query = f"DROP TABLE IF EXISTS {table}"
        self.execute_query(query)
    
    def list_tables(self):
        return self.fetch_all("SHOW TABLES")
    
    def close_connection(self):
        self.cursor.close()
        self.connection.close()

# Example usage
# mysql_handler = MySQLHandler("localhost", "root", "password", "testdb")
# mysql_handler.insert_one("users", {"name": "John", "age": 30})
