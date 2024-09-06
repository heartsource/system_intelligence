# Stage 1: Build Stage
FROM python:3.9-slim

WORKDIR /app

# Copy only the requirements to install dependencies
COPY ./py_lib/requirements.txt .

# Install dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Set default environment file
ARG ENV_FILE=.env.development
COPY ./environments/${ENV_FILE} .env

EXPOSE 8080

CMD ["python", "main.py"]
