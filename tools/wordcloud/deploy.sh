#!/bin/bash

# Build the project
npm run build

# Create a backup of the current dist directory if it exists
if [ -d "dist.bak" ]; then
    rm -rf dist.bak
fi

if [ -d "dist" ]; then
    mv dist dist.bak
fi

# Build the project
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful!"
    
    # Remove backup if build was successful
    if [ -d "dist.bak" ]; then
        rm -rf dist.bak
    fi
    
    echo "Deployment complete! The WordCloud tool is now ready to use."
    echo "You can access it at: tools/wordcloud/dist/index.html"
else
    echo "Build failed!"
    
    # Restore backup if build failed
    if [ -d "dist.bak" ]; then
        rm -rf dist
        mv dist.bak dist
        echo "Previous version restored from backup."
    fi
    
    exit 1
fi