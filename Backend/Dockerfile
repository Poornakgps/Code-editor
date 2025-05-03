# Use Node.js LTS version
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# Copy package.json and package-lock.json first for better caching
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Install Docker CLI (needed for container-in-container execution)
RUN apt-get update && apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    && curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list \
    && apt-get update \
    && apt-get install -y docker-ce-cli \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create necessary directories and files
RUN mkdir -p Docker \
    && touch Docker/input.txt Docker/verdict.txt Docker/memorylimit.txt Docker/timelimit.txt \
    && chmod 666 Docker/input.txt Docker/verdict.txt Docker/memorylimit.txt Docker/timelimit.txt

# Expose port
EXPOSE 5001

# Run the backend server
CMD ["node", "server.js"]
