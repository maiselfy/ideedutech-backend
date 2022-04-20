FROM node:lts

# this step is just for run containers on Mac M1 Silicon chip
# if this is not your case, don't run the follow commands belloe
# RUN apk add --update --no-cache make gcc libsass g++
# RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
# RUN apk add --update --no-cache alpine-sdk openssl-dev
# RUN python3 -m ensurepip
# RUN pip3 install --no-cache --upgrade pip setuptools
RUN apt-get -qy update && apt-get -qy install openssl

EXPOSE 3333

WORKDIR /api
ENV PATH /app/node_modules/.bin:$PATH

COPY . /api

RUN npm install
RUN npm run build
RUN npx prisma generate
CMD ["npm", "run","start:prod"]
