from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, table

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React chạy ở port này
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(table.router, prefix="/api")
