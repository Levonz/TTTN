from fastapi import APIRouter, HTTPException, Body
from database.mongo import db
from bson import ObjectId
from datetime import datetime
import bcrypt

router = APIRouter()
staff_collection = db["staff"]


@router.get("/staff")
async def get_staff():
    staff_list = []
    async for s in staff_collection.find():
        staff_list.append(
            {
                "id": str(s.get("_id", "")),
                "username": s.get("username", ""),
                "name": s.get("name", ""),
                "role": s.get("role", "staff"),
                "phone": s.get("phone", ""),
                "created_at": s.get("created_at", ""),
            }
        )
    return staff_list


@router.post("/staff")
async def create_staff(data: dict = Body(...)):
    if await staff_collection.find_one({"username": data.get("username")}):
        raise HTTPException(status_code=400, detail="Username đã tồn tại")

    raw_password = data.get("password", "")
    if not raw_password:
        raise HTTPException(status_code=400, detail="Bạn phải nhập mật khẩu")

    hashed_pw = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    new_staff = {
        "username": data.get("username", ""),
        "name": data.get("name", ""),
        "role": data.get("role", "staff"),
        "phone": data.get("phone", ""),
        "password": hashed_pw,  
        "created_at": datetime.utcnow()
    }
    result = await staff_collection.insert_one(new_staff)
    return {"id": str(result.inserted_id)}

@router.put("/staff/{staff_id}")
async def update_staff(staff_id: str, data: dict = Body(...)):
    update_data = {
        "name": data.get("name", ""),
        "role": data.get("role", "staff"),
        "phone": data.get("phone", ""),
    }
    result = await staff_collection.update_one(
        {"_id": ObjectId(staff_id)}, {"$set": update_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhân viên")
    return {"msg": "Cập nhật thành công"}


@router.delete("/staff/{staff_id}")
async def delete_staff(staff_id: str):
    result = await staff_collection.delete_one({"_id": ObjectId(staff_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhân viên")
    return {"msg": "Đã xóa nhân viên"}
