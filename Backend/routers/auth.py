from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from utils.auth import create_access_token, decode_access_token
from database.mongo import db
import bcrypt

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
    raw_password = data.password.encode("utf-8")
    hashed_pw_from_db = staff.get("password", "").encode("utf-8")
    if not bcrypt.checkpw(raw_password, hashed_pw_from_db):
        raise HTTPException(status_code=401, detail="Sai tài khoản hoặc mật khẩu")
    token_payload = {"sub": staff["username"], "role": staff["role"]}
    access_token = create_access_token(data=token_payload)
    return {
        "success": True,
        "access_token": access_token,
        "role": staff["role"],
        "message": "Đăng nhập thành công",
    }


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login", auto_error=False)


@router.get("/user-info")
async def get_user_info(token: str | None = Depends(oauth2_scheme)):
    if token is None:
        raise HTTPException(
            status_code=401, detail="Yêu cầu cần được xác thực (token bị thiếu)"
        )
    payload = decode_access_token(token)
    if payload and "sub" in payload and "role" in payload:
        return {"username": payload["sub"], "role": payload["role"]}
    raise HTTPException(status_code=401, detail="Token không hợp lệ hoặc đã hết hạn")
