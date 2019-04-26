FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# install app dependency
COPY package.json . 
RUN npm install

## Bundle app resource 
COPY . .
# Set enviornment variables
ENV NODE_ENV="development" PORT="8081"

EXPOSE 8081

CMD [ "npm", "run", "start"]