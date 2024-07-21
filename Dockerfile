FROM node:latest

RUN apt-get update && apt-get install -y ffmpeg --no-install-recommends

WORKDIR /usr/app

COPY data/package.json .
RUN npm install --quiet

COPY data/* .

RUN mkdir -p /usr/app/yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/app/yt-dlp/yt-dlp
RUN chmod a+rx /usr/app/yt-dlp/yt-dlp
