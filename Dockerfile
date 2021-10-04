FROM node:latest

RUN apt-get update

# install python
RUN apt-get install python3
RUN apt-get install -y python3-pip # -y says yes to the prompt

# install supervisor (manages the running applications)
RUN apt-get install -y supervisor

RUN npm install http-proxy-middleware --save

WORKDIR /root

ENV HOME /root

# add app
COPY . .
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN pip3 install -r requirements.txt

RUN yarn install

EXPOSE 3000

# start app
CMD ["/usr/bin/supervisord"]
# CMD "cd flask && flask run"

# https://advancedweb.hu/supervisor-with-docker-lessons-learned/
# https://docs.docker.com/config/containers/multi-service_container/
# https://docs.docker.com/language/python/build-images/
# http://supervisord.org/running.html#running-supervisord

# Local testing:
# yarn start --> react server @ port 3000
# yarn start-api --> flask server @ port 5000

# Dockerfile:
# 'supervisord' runs 'yarn start' and 'yarn start-flask' as independent processes

# 'yarn start-both' does NOT work

# Notes:
# 'flask run --no-debugger' is necessary so JSON is formatted properly between flask/react components
# supervisord.conf needs the 'nodaemon=true' to work with Docker