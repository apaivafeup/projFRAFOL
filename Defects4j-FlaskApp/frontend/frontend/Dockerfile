# Use a lightweight Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose the frontend development port (Vite or React)
EXPOSE 5173

# Start the React app
CMD ["npm", "run", "dev"]
