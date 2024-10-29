#!/bin/bash

# Check if a commit message was provided
if [ -z "$1" ]; then
    echo "Error: No commit message provided."
    echo "Usage: bash $0 'Your commit message'"
    exit 1
fi

# Assign the first argument as the commit message
COMMIT_MESSAGE="$1"

# Display current Git status
echo "Checking Git status..."
git status

# Exclude specific directories and add all other changes to the staging area
echo "Adding all changes to staging, excluding specific directories..."
git add . -- ':!logs' ':!temp' ':!node_modules'

# Check if there are any changes to commit
if git diff --cached --quiet; then
    echo "No changes to commit."
    exit 0
fi

# Commit the changes
echo "Committing changes..."
if git commit -m "$COMMIT_MESSAGE"; then
    echo "Commit successful."
else
    echo "Commit failed."
    exit 1
fi

# Push the changes to the remote repository
echo "Pushing changes to remote..."
if git push; then
    echo "Push successful."
else
    echo "Push failed."
    exit 1
fi
