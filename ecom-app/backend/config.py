# backend/config.py
import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        'postgresql://myuser:newpassword@localhost/mydatabase'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'a_very_secret_key_here')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'another_secret_key_here')
