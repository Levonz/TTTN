from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, table, menu, order, invoice, staff

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(table.router, prefix="/api")
app.include_router(menu.router, prefix="/api")
app.include_router(order.router, prefix="/api")
app.include_router(invoice.router, prefix="/api")
app.include_router(staff.router, prefix="/api")
