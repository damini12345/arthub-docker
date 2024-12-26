#Use a Node.js base image
FROM node:20-alpine AS build

#Set the working directory inside the container - WORKDIR /arthub/front
WORKDIR /arthub

#Copy package.json and package-lock.json into the container
COPY package*.json ./

#Install dependencies
RUN npm install

#Copy the rest of the application files
COPY . .

#stage 2
FROM node:20-alpine

#Set the working directory for the runtime container
WORKDIR /arthub

#Copy only necessary files from the build stage
COPY --from=build /arthub .

#Expose the application port
EXPOSE 3000

#Specify the command to run the application
CMD ["node", "index.js"]
