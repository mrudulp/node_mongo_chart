import pymongo
import pprint
import datetime
import os
import json

from pymongo import MongoClient

class DbOps(object):
    
    def __init__(self):
        dbname = os.getenv('MONGO_DB', 'dummyDb')
        coll = os.getenv('MONGO_COLLECTION','dbColl')
        port = os.getenv('MONGO_PORT','27017')
        host = os.getenv('MONGO_HOST','localhost')
        url = 'mongodb://{0}:{1}/'.format(host,port)
        print("url:{0}".format(url))

        client = MongoClient(url)
        db = client[dbname]
        self.collection = db[coll]
        if dbname in client.database_names():
            print("db exists::{0}".format(client.database_names()))

        else:
            print("creating db")
            post = {"date": datetime.datetime.utcnow()}
            self.collection.insert_one(post)

    def is_json(self, json_string):
        try:
            json_object = json.loads(json_string)
        except ValueError, e:
            print("JSON String Error::{0}".format(e))
            return False
        return True

    def insertValue(self,value):
        if self.is_json(value):
            self.collection.insert_one(json.loads(value))
        else:
            print("Invalid json string")
        
    def printAllDb(self):
        for data in self.collection.find():
            print(data)
                
if __name__ == "__main__":
    dbo = DbOps()
    tags = ["mongodb", "python", "pymongo"]
    post =  "{{\"author\": \"{0}\", \"text\": \"{1}\", \"tags\": \"{2}\", \"date\": \"{3}\"}}".format("Arthur", "Next blog post!", tags, datetime.datetime.utcnow())
    print(post)
    dbo.insertValue(post)
    post = """{"sas"}"""
    dbo.insertValue(post)
    dbo.printAllDb()

# db2 = client.dummyDb2
# for dbname in client.database_names():
#     print(dbname)
# db = client.dummyDb
# collection = db.dcoll

# post = {"author": "Mike", "text": "My first blog post!", "tags": ["mongodb", "python", "pymongo"], "date": datetime.datetime.utcnow()}

# collection.insert_one(post)

# for data in collection.find():
#     pprint.pprint(data)

# connection = Connection('localhost', 27017)
# print(connection.database_names())