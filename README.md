# Showcase for Azure Cognitive Translations service

based on templase: Getting Started with Create React App and Fluent UI

Build Satus:
[![Azure Static Web Apps CI/CD](https://github.com/michalmar/hack-for-translation/actions/workflows/azure-static-web-apps-icy-bush-08c57d903.yml/badge.svg)](https://github.com/michalmar/hack-for-translation/actions/workflows/azure-static-web-apps-icy-bush-08c57d903.yml)

## Installation/setup:

- To install env for the API/Functions

    `pip install  -r api\requirements.txt`

- To install all nodes deps

    `npm install`

## Local Debug

- Runs the app and also asociated Azure Functions (apis) in debug mode.

    `swa start build --api-location api`

    > note: you need to run `npm run build` first

- Start the web app only
    
    `npm start`

    Runs the app in the development mode.<br>
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

    The page will reload if you make edits.<br>
    You will also see any lint errors in the console.


## Build/Prod

`npm run build` - Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!