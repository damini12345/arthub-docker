#Use a Node.js base image
FROM node:20-alpine

# Create a user with no password and add them to the 'users' group
#RUN adduser -D myuser

# Set the user for the rest of the image build
#USER myuser -> when the container starts, it will not run as root, but instead as the non-privileged myuser.

#Set the working directory inside the container - WORKDIR /arthub/admin
WORKDIR /arthub

#Copy package.json and package-lock.json into the container
COPY package*.json ./

#Install dependencies
RUN npm install

#Copy the rest of the application files
COPY . .

#Expose the application port
EXPOSE 3001

#Specify the command to run the application
CMD ["node", "index.js"]
