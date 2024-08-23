# Stage 1: Build Stage
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9 AS build

WORKDIR /app

# Copy only the requirements to install dependencies
COPY ./py_lib/requirements.txt .

# Install dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Stage 2: Production Stage
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9 AS production

WORKDIR /app

# Copy installed packages from build stage
COPY --from=build /usr/local/lib/python3.9/site-packages/ /usr/local/lib/python3.9/site-packages/
COPY --from=build /usr/local/bin/ /usr/local/bin/

# Copy the rest of the application code
COPY . /app

# Set default environment file
ARG ENV_FILE=.env.development
COPY ./environments/${ENV_FILE} .env

EXPOSE 80
