FROM python:3.9-slim AS build

# Copy only the requirements file and install dependencies
COPY ./py_lib/requirement.txt /py_lib/requirement.txt
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r /py_lib/requirement.txt

FROM python:3.9-slim AS production

# Copy only necessary files from the build stage
COPY --from=build /usr/local/lib/python3.9/site-packages/ /usr/local/lib/python3.9/site-packages/
COPY --from=build /usr/local/bin/ /usr/local/bin/

# Copy your application code
COPY ./app/ /app/

EXPOSE 8501

HEALTHCHECK CMD curl --fail http://localhost:8501/_stcore/health

ENTRYPOINT ["streamlit", "run", "/app/main.py", "--server.port=8501", "--server.address=0.0.0.0"]