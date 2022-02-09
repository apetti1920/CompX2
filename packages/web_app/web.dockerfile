# Initialize from a base node folder
FROM node:14 as build

WORKDIR app
# Copy in the package json
#COPY ./