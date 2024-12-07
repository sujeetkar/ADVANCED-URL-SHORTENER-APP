# Use the latest Node.js image as a base
FROM node:latest


# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY  . .
RUN npm install
RUN npm run build
# Copy the build files from the dist folder to the container
# COPY ./dist .

# Expose the port your app runs on
EXPOSE 8010

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8010/health || exit 1

# Start the application
CMD ["node", "dist/server.js"]
