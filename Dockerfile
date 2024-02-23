FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9
COPY ./app/* /app/
VOLUME /model
COPY ./model/* /model/
COPY ./config/* /config/
RUN pip install --upgrade pip
RUN pip install -r /app/requirement.txt
EXPOSE 80