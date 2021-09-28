FROM node:latest

WORKDIR /root

ENV HOME /root

# add app
COPY . .
RUN yarn install

EXPOSE 3000

# start app
CMD ["yarn", "start"]    