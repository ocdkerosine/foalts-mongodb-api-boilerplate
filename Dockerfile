# Create image based on the official latest Node image from the dockerhub
FROM node:latest

# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json /usr/src/app

# Install the generator used to build the API
RUN npm install -g @foal/cli

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . /usr/src/app

# Expose the port the app runs in
EXPOSE 3001

RUN useradd -ms /bin/bash docker

USER docker

# Serve the app
CMD ["npm", "run", "docker"]