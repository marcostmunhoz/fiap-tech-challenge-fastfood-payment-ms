FROM python:3.9-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY data/entrypoint.py /app/entrypoint.py
COPY data/requirements.txt /app/requirements.txt

RUN pip install -r /app/requirements.txt

CMD ["python", "/app/entrypoint.py"]