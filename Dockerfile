FROM node:latest

RUN apt-get update && apt-get install -y ffmpeg --no-install-recommends

WORKDIR /usr/app

COPY data/package.json .
RUN npm install --quiet

COPY data/* .
