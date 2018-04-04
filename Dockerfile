FROM node:carbon

RUN mkdir /be_exercise
ADD . /be_exercise
WORKDIR /be_exercise
RUN npm i