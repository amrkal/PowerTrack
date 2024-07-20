import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://amrkal:124487@localhost:5432/powertrack'
    SQLALCHEMY_BINDS = {
        'items': 'postgresql://amrkal:124487@localhost:5432/items_db'
    }
    SQLALCHEMY_TRACK_MODIFICATIONS = False
