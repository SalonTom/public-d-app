# Use the official lightweight Python image
FROM python:3.9

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR ./ia-server

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libgl1-mesa-glx \
        libglib2.0-0 \
        libsm6 \
        libxrender1 \
        libxext6 \
        tesseract-ocr \
        libtesseract-dev \
        unzip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Extract the executable from the zip file (if needed)
COPY tesseract-3.02.02-win32-lib-include-dirs.zip /app
RUN unzip tesseract-3.02.02-win32-lib-include-dirs.zip && rm tesseract-3.02.02-win32-lib-include-dirs.zip

# Expose port 5000 to the outside world
EXPOSE 5000

# Command to run the application
CMD ["flask", "--app", "app", "run", "--host=0.0.0.0"]