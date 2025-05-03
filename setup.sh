#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== Starting Online Code Judge Platform Setup =====${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker and Docker Compose first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file with default values...${NC}"
    cat > .env << EOL
DB_HOST=postgres
DB_USER=chandu
DB_PASSWORD=test@1234
DB_NAME=postgres
DB_PORT=5432
EOL
fi

# Create necessary directories and files
echo -e "${YELLOW}Creating necessary files and directories...${NC}"
mkdir -p Backend/Docker

# Create and write entrypoint.sh if it doesn't exist
if [ ! -f "Backend/Docker/entrypoint.sh" ]; then
    echo -e "${YELLOW}Creating entrypoint.sh...${NC}"
    cat > Backend/Docker/entrypoint.sh << 'EOL'
#!/bin/bash

# Read time limit from timelimit.txt
if [ -f "timelimit.txt" ]; then
  timelimit=$(cat timelimit.txt)
else
  echo "Error: timelimit.txt file not found!" > verdict.txt
  exit 1
fi

# Read memory limit from memorylimit.txt
if [ -f "memorylimit.txt" ]; then
  memorylimit=$(cat memorylimit.txt)
else
  echo "Error: memorylimit.txt file not found!" > verdict.txt
  exit 1
fi

# Determine the language based on file extension
if [ -f "code.cpp" ]; then
  language="cpp"
  source_file="code.cpp"
elif [ -f "code.py" ]; then
  language="python"
  source_file="code.py"
elif [ -f "code.js" ]; then
  language="javascript"
  source_file="code.js"
elif [ -f "code.java" ]; then
  language="java"
  source_file="code.java"
elif [ -f "code.go" ]; then
  language="go"
  source_file="code.go"
else
  echo "Error: No supported source file found!" > verdict.txt
  exit 1
fi

# Handle compilation and execution based on language
case $language in
  cpp)
    # Compile the C++ code
    g++ -O2 -o code $source_file 2> verdict.txt
    if [ $? -eq 0 ]; then
      # Run the compiled program
      timeout "${timelimit}s" ./code < input.txt >> verdict.txt 2>&1
      exit_code=$?
      if [ $exit_code -eq 124 ]; then
        echo "Time Limit Exceeded (${timelimit}s)" >> verdict.txt
      elif [ $exit_code -ne 0 ]; then
        echo "Runtime Error (exit code: $exit_code)" >> verdict.txt
      fi
    else
      echo "Compilation failed." >> verdict.txt
      exit 1
    fi
    ;;
    
  python)
    # Run Python code directly
    timeout "${timelimit}s" python $source_file < input.txt > verdict.txt 2>&1
    exit_code=$?
    if [ $exit_code -eq 124 ]; then
      echo "Time Limit Exceeded (${timelimit}s)" >> verdict.txt
    elif [ $exit_code -ne 0 ]; then
      echo "Runtime Error (exit code: $exit_code)" >> verdict.txt
    fi
    ;;
    
  javascript)
    # Run JavaScript code with Node.js
    timeout "${timelimit}s" node $source_file < input.txt > verdict.txt 2>&1
    exit_code=$?
    if [ $exit_code -eq 124 ]; then
      echo "Time Limit Exceeded (${timelimit}s)" >> verdict.txt
    elif [ $exit_code -ne 0 ]; then
      echo "Runtime Error (exit code: $exit_code)" >> verdict.txt
    fi
    ;;
    
  java)
    # Compile Java code
    javac $source_file 2> verdict.txt
    if [ $? -eq 0 ]; then
      # Find the class name (assuming it's the same as the file name without extension)
      class_name=$(basename $source_file .java)
      # Run the compiled Java program
      timeout "${timelimit}s" java -Xmx${memorylimit}m $class_name < input.txt >> verdict.txt 2>&1
      exit_code=$?
      if [ $exit_code -eq 124 ]; then
        echo "Time Limit Exceeded (${timelimit}s)" >> verdict.txt
      elif [ $exit_code -ne 0 ]; then
        echo "Runtime Error (exit code: $exit_code)" >> verdict.txt
      fi
    else
      echo "Compilation failed." >> verdict.txt
      exit 1
    fi
    ;;
    
  go)
    # Compile Go code
    go build -o code_go $source_file 2> verdict.txt
    if [ $? -eq 0 ]; then
      # Run the compiled Go program
      timeout "${timelimit}s" ./code_go < input.txt >> verdict.txt 2>&1
      exit_code=$?
      if [ $exit_code -eq 124 ]; then
        echo "Time Limit Exceeded (${timelimit}s)" >> verdict.txt
      elif [ $exit_code -ne 0 ]; then
        echo "Runtime Error (exit code: $exit_code)" >> verdict.txt
      fi
    else
      echo "Compilation failed." >> verdict.txt
      exit 1
    fi
    ;;
esac
EOL
    chmod +x Backend/Docker/entrypoint.sh
fi

# Create empty files needed by the application
touch Backend/Docker/input.txt Backend/Docker/verdict.txt Backend/Docker/memorylimit.txt Backend/Docker/timelimit.txt
chmod 666 Backend/Docker/input.txt Backend/Docker/verdict.txt Backend/Docker/memorylimit.txt Backend/Docker/timelimit.txt

# Set up PostgreSQL initialization script
mkdir -p postgres-init
if [ ! -f "postgres-init/init.sql" ]; then
    echo -e "${YELLOW}Creating PostgreSQL initialization script...${NC}"
    cat > postgres-init/init.sql << 'EOL'
-- Create problems table
CREATE TABLE IF NOT EXISTS problems (
    problem_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    rating DECIMAL(5,2) NOT NULL,
    input TEXT NOT NULL,
    output TEXT NOT NULL,
    memorylimit VARCHAR(20) NOT NULL,
    timelimit VARCHAR(20) NOT NULL,
    inputformat TEXT NOT NULL,
    outputformat TEXT NOT NULL,
    constrains TEXT NOT NULL
);

-- Create contest table
CREATE TABLE IF NOT EXISTS contest (
    contest_id SERIAL PRIMARY KEY,
    contest_name VARCHAR(255) NOT NULL,
    contest_start_time BIGINT NOT NULL,
    contest_duration BIGINT NOT NULL,
    contest_problem INTEGER[] NOT NULL
);

-- Insert sample problem for testing
INSERT INTO problems (title, description, rating, input, output, memorylimit, timelimit, inputformat, outputformat, constrains)
VALUES (
    'Hello World',
    'Print "Hello, [input]!" where [input] is the provided name',
    800,
    'World',
    'Hello, World!',
    '128MB',
    '1s',
    'A single string representing a name',
    'A greeting message in the format "Hello, [name]!"',
    'The input string will not exceed 100 characters'
);

-- Insert sample contest for testing
INSERT INTO contest (contest_name, contest_start_time, contest_duration, contest_problem)
VALUES (
    'Welcome Contest',
    EXTRACT(EPOCH FROM NOW() + INTERVAL '1 day')::BIGINT,
    7200, -- 2 hours in seconds
    ARRAY[1] -- Assuming problem_id 1 exists
);
EOL
fi

# Create or update Backend Dockerfile
echo -e "${YELLOW}Creating Backend Dockerfile...${NC}"
cat > Backend/Dockerfile << 'EOL'
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
EOL

# Create or update Sandbox Dockerfile
echo -e "${YELLOW}Creating Sandbox Dockerfile...${NC}"
cat > Backend/Docker/Dockerfile << 'EOL'
# Use the latest Ubuntu image as the base
FROM ubuntu:latest

# Install necessary packages
RUN apt-get update && apt-get install -y \
    g++ \
    make \
    python3 \
    python3-pip \
    default-jdk \
    nodejs \
    npm \
    golang \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Create symbolic links for easier command usage
RUN ln -s /usr/bin/python3 /usr/bin/python

# Set the working directory inside the container
WORKDIR /sandbox

# Copy the entrypoint script into the container
COPY entrypoint.sh /usr/local/bin/

# Make the script executable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Set the entrypoint to the script
ENTRYPOINT ["entrypoint.sh"]
EOL

# Create or update Frontend Dockerfile
echo -e "${YELLOW}Creating Frontend Dockerfile...${NC}"
cat > Frontend/Dockerfile.dev << 'EOL'
# Use Node.js as the base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose the port Vite uses
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
EOL

# Build and start the containers
echo -e "${GREEN}Building and starting containers...${NC}"
docker-compose up -d

# Check if containers are running
echo -e "${GREEN}Checking container status...${NC}"
docker-compose ps

echo -e "${GREEN}Setup completed! Your Online Code Judge platform should be running at:${NC}"
echo -e "${YELLOW}Frontend: http://localhost:3000${NC}"
echo -e "${YELLOW}Backend API: http://localhost:5001${NC}"
echo -e "${GREEN}You can check logs with: docker-compose logs -f${NC}"