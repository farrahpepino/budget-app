# Full Stack Finance / Transactions App

This is a full-stack web application built with React (Vite) on the frontend and FastAPI on the backend, using MySQL as the database. The app supports user authentication via Google OAuth and allows users to manage accounts and track transactions.

Soon, I'll be integrating LLMS and adding graphs to provide behavioral insights on user's spending habits.

## Project Structure
- client → React frontend
- server → FastAPI backend

## Setup Instructions

### Clone the project
git clone https://github.com/farrahpepino/budget-app.git
cd budget-app

## Client Setup (React)

cd client
npm install

Create .env in /client:
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=your_server_url

Run frontend:
npm run dev

Frontend runs on:
http://localhost:5173

## Server Setup (FastAPI)

cd server
python -m venv venv

Activate venv:
Mac/Linux:
source venv/bin/activate

Windows:
venv\Scripts\activate

Install dependencies:
pip install -r requirements.txt

If needed:
fastapi
uvicorn
sqlalchemy
pymysql
python-dotenv
google-auth
python-multipart

Create .env in /server:
db_url=mysql+pymysql://root:YOUR_PASSWORD@localhost/YOUR_DATABASE
google_client_id=your_google_client_id

To get google client id, just follow the instructions: https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid#get_your_google_api_client_id

Start MySQL and create database:
CREATE DATABASE your_database;

Run backend:
uvicorn main:app --reload

Backend runs on:
http://localhost:8000

## Authentication
Google OAuth is used. Ensure client ID matches in both frontend and backend.


## Tech Stack
Frontend: React, Vite, Axios, React Router
Backend: FastAPI, SQLAlchemy, Uvicorn, Pydantic
Database: MySQL, PyMySQL

## Notes
- Backend must run before frontend
- MySQL must be running
- Keep .env files private
