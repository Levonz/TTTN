from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from utils.auth import create_access_token
from utils.auth import decode_access_token

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(data: LoginRequest):
    # DEMO: hardcoded tài khoản
    if data.username == "admin" and data.password == "admin":
        access_token = create_access_token({
            "sub": data.username,
            "role": "admin"
        })
        return {
            "success": True,
            "access_token": access_token,
            "role": "admin",  # gửi về cho frontend
            "message": "Đăng nhập thành công"
        }

    elif data.username == "nhanvien" and data.password == "nhanvien":
        access_token = create_access_token({
            "sub": data.username,
            "role": "employee"
        })
        return {
            "success": True,
            "access_token": access_token,
            "role": "employee",
            "message": "Đăng nhập thành công"
        }

    raise HTTPException(status_code=401, detail="Sai tài khoản hoặc mật khẩu")

@router.get("/user-info")
def get_user_info(Authorization: str = Header(...)):
    token = Authorization.split(" ")[1]  # Tách "Bearer <token>"
    payload = decode_access_token(token)
    if payload:
        return {"username": payload["sub"], "role": "admin"}
    raise HTTPException(status_code=401, detail="Token không hợp lệ")