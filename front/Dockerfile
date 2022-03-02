# This code is taken from https://mherman.org/blog/dockerizing-a-react-app/
# pull official base image
FROM node:16.14-alpine3.15

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
# COPY package-lock.json ./
RUN mkdir -p /app/node_modules/.cache
RUN chown -R node:node /app/node_modules
RUN npm install 
RUN npm install react-scripts@4.0.3 -g 

# add app
COPY . ./
# RUN chown -R node:node /app/node_modules
USER node

# start app
CMD ["npm", "start"]

