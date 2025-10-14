# Use Python 3.12 slim image as base
FROM python:3.12-slim

# Set working directory inside container
WORKDIR /app

# Install system dependencies required for PostgreSQL and Python packages
RUN apt-get update && apt-get install -y \
    postgresql-client \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file first for better Docker layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Expose port 8000 for Django development server
EXPOSE 8000

# Default command to start Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
