FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9
COPY ./app/* /app/
pip install openai
EXPOSE 80