FROM python:3.10.14-bullseye
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt

RUN chmod a+x run.sh
CMD ["./run.sh"]