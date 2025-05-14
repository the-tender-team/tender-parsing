from fastapi import FastAPI
from auth import routes as auth_routes
from parser import routes as parser_routes

app = FastAPI()
app.include_router(auth_routes.router)
app.include_router(parser_routes.router)
