# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Install curl for Docker healthchecks
RUN apt-get update && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /usr/src/app/backend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Run as a non-root user for better security
RUN useradd -m appuser && chown -R appuser:appuser /usr/src/app/backend
USER appuser

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]
