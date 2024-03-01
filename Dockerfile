FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9
COPY ./app/* /app/
COPY ./config/* /config/
COPY ./knowledge/* /knowledge/
RUN pip install --upgrade pip
RUN pip install -r /app/requirement.txt
EXPOSE 80