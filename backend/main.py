from fastapi import FastAPI
from auth import routes as auth_routes

app = FastAPI()
app.include_router(auth_routes.router)
