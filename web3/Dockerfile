# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app/web3

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install

# Copy the rest of the web3 source code
COPY . .

# Make port 8545 available to the world outside this container
EXPOSE 8545

# Define the command to run the app
CMD ["npx", "hardhat", "node"]
