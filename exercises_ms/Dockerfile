FROM --platform=linux/amd64 python:3.10.16-slim

WORKDIR app
COPY requirements.txt ./

RUN python --version
RUN pip install --upgrade --no-cache-dir pip==23.2.1
RUN pip --version
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 3006/tcp
ENV PYTHONUNBUFFERED=1

CMD [ "flask", "--app", ".", "run", "--host=0.0.0.0", "--port=3006" ]