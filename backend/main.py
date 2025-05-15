from fastapi import FastAPI
from auth import routes as auth_routes
from parser import routes as parser_routes
from admin_requests import routes as admin_requests_routes

app = FastAPI()
app.include_router(auth_routes.router)
app.include_router(parser_routes.router)
app.include_router(admin_requests_routes.router)

from database.database import Base, engine
import database.models

# Base.metadata.drop_all(bind=engine) 
Base.metadata.create_all(bind=engine)