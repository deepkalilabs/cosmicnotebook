# Base image
FROM node:18.18.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock for dependency installation
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the application port (default is often 3000 for `yarn dev`)
EXPOSE 3000

# Command to start the development server
CMD ["yarn", "dev"]

