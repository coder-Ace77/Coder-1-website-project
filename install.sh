#!/bin/bash

# Update package lists
echo "Updating package lists..."
sudo apt-get update

# Install curl if not present
if ! command -v curl &> /dev/null
then
    echo "curl could not be found. Installing curl..."
    sudo apt-get install -y curl
fi

# Install Node.js and npm
if ! command -v node &> /dev/null
then
    echo "Node.js not found. Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "Node.js is already installed."
fi

# Install npm if it's not already installed
if ! command -v npm &> /dev/null
then
    echo "npm not found. Installing npm..."
    sudo apt-get install -y npm
else
    echo "npm is already installed."
fi

# Move to the backend directory
cd backend

# Create directories for codes and compiled_codes
mkdir -p codes
mkdir -p compiled_codes

echo "Directories backend/codes and backend/compiled_codes have been created."

# Install backend project dependencies
if [ -f "package.json" ]; then
    echo "Installing backend project dependencies..."
    npm install
else
    echo "No package.json found in the backend directory. Skipping npm install."
fi

# Move to the frontend directory
cd ../frontend

# Install frontend project dependencies
if [ -f "package.json" ]; then
    echo "Installing frontend project dependencies..."
    npm install
else
    echo "No package.json found in the frontend directory. Skipping npm install."
fi

echo "Installation complete!"
