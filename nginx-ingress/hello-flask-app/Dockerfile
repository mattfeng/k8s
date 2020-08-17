FROM python:3.8-buster

RUN mkdir /src
WORKDIR /src

ADD ./app.py /src
ADD ./requirements.txt /src

RUN pip install -r requirements.txt

ENV FLASK_APP="/src/app.py"

ENTRYPOINT ["flask", "run", "--host=0.0.0.0"]
