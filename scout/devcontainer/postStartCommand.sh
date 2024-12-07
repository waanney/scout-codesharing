#!/usr/bin/bash

WORKSPACE_FOLDER=$(pwd)

# Add safe directory
git config --global --add safe.directory "${WORKSPACE_FOLDER}"

# Disable GPG signing.
# This is because the local path is not the same as in container.
git config --global commit.gpgsign false

# Set permissions for node_modules, because this data comes from a volume
sudo chown -R node:node node_modules

# Install dependencies
yarn install