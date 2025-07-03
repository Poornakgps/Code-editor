# Use Node.js LTS version
FROM node:20-slim

# Install Docker CLI - simplified approach
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    gnupg \
    lsb-release \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null \
    && apt-get update \
    && apt-get install -y docker-ce-cli \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Clean npm cache and install dependencies
RUN npm cache clean --force && \
    npm install --production && \
    npm list

# Copy application source code
COPY . .

# Create necessary directories and files
RUN mkdir -p Docker \
    && touch Docker/input.txt Docker/verdict.txt Docker/memorylimit.txt Docker/timelimit.txt \
    && chmod 666 Docker/input.txt Docker/verdict.txt Docker/memorylimit.txt Docker/timelimit.txt

# Expose port
EXPOSE 5001

# Run the backend server
CMD ["npm", "start"]
