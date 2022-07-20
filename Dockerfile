# Specify a base image
FROM node:alpine
WORKDIR /usr/app


# Install some dependencies
COPY ./package.json ./
RUN yarn install
COPY ./ ./

EXPOSE 8080
# Default command
CMD ["yarn", "start"]
