from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from utils.auth import create_access_token, decode_access_token
from database.mongo import db 
import bcrypt

# Nếu bạn dùng motor: from database.mongo import staff_collection

router = APIRouter()
staff_collection = db["staff"]


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
async def login(data: LoginRequest):
    staff = await staff_collection.find_one({"username": data.username})
    if not staff:
        raise HTTPException(status_code=401, detail="Sai tài khoản hoặc mật khẩu")

    raw_password = data.password
    hashed_pw = staff.get("password", "")

    # So sánh mật khẩu nhập vào với mật khẩu đã hash trong DB
    if not bcrypt.checkpw(raw_password.encode("utf-8"), hashed_pw.encode("utf-8")):
        raise HTTPException(status_code=401, detail="Sai tài khoản hoặc mật khẩu")

    access_token = create_access_token(
        {"sub": staff["username"], "role": staff["role"]}
    )
    return {
        "success": True,
        "access_token": access_token,
        "role": staff["role"],
        "message": "Đăng nhập thành công",
    }


@router.get("/user-info")
def get_user_info(Authorization: str = Header(...)):
    token = Authorization.split(" ")[1]  # Tách "Bearer <token>"
    payload = decode_access_token(token)
    if payload:
        return {"username": payload["sub"], "role": payload["role"]}
    raise HTTPException(status_code=401, detail="Token không hợp lệ")
