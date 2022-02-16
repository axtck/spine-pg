# Alpine base
FROM node:16-alpine

# create app dir
WORKDIR /usr/src/app

# copy package.json & package.lock.json
COPY package*.json ./

# try to get a port via build-arg and check 
ARG PORT 
RUN test -n "$PORT" || (echo "PORT not set" && false)

# install dependencies
RUN npm ci 

# bundle src
COPY . .

# expose port
EXPOSE $PORT
RUN echo "exposed port $PORT"

# start server
CMD npm start