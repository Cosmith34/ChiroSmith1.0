# Use official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install


# Copy all remaining app files
COPY . .

# Expose the port (from your .env, usually 3131)
EXPOSE 3131

# Run the app
CMD ["node", "index.js"]
