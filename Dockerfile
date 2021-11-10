#FROM node:16.13.0
#
#RUN apt-get update
#
#WORKDIR /root
#ENV HOME /root
#
#COPY . .
#
#RUN npm install
#
#EXPOSE 3000
#
#CMD npm start

#FROM node:latest
FROM node:16.13.0

RUN apt-get update

# install python
RUN apt-get install python3
RUN apt-get install -y python3-pip # -y says yes to the prompt

# install supervisor (manages the running applications)
RUN apt-get install -y supervisor

WORKDIR /root

ENV HOME /root

# add app
COPY . .
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN pip3 install -r requirements.txt
RUN npm install

EXPOSE 3000
EXPOSE 5000

# start app
# CMD ./runprog 2
CMD ["/usr/bin/supervisord"]

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
# 'flask run --no-debugger' is necessary so JSON is formatted properly between flask/react componds the 'nodaemon=true' to work with Docker