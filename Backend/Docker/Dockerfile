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
