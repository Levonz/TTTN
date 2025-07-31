import bcrypt
from pymongo import MongoClient
from datetime import datetime

client = MongoClient("mongodb://localhost:27017")
db = client["restaurant"]    
staff_collection = db["staff"]

password = "admin"  
hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

admin_data = {
    "username": "admin",
    "name": "Quản trị viên",
    "role": "admin",
    "phone": "0909000000",
    "password": hashed_pw,
    "created_at": datetime.utcnow()
}

if not staff_collection.find_one({"username": "admin"}):
    staff_collection.insert_one(admin_data)
    print("Đã thêm tài khoản admin.")
else:
    print("Tài khoản admin đã tồn tại.")
