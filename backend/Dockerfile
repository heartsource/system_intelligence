# Stage 1: Build Stage
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9 AS build

# Copy only the requirements file and install dependencies
COPY ./py_lib/requirement.txt /py_lib/requirement.txt
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r /py_lib/requirement.txt

# Stage 2: Production Stage
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9 AS production

# Copy only necessary files from the build stage
COPY --from=build /usr/local/lib/python3.9/site-packages/ /usr/local/lib/python3.9/site-packages/
COPY --from=build /usr/local/bin/ /usr/local/bin/

# Copy your application code
COPY ./app/ /app/
COPY ./knowledge/ /knowledge/

# Expose port
EXPOSE 80