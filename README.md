# Showcase for Azure Cognitive Translations service

based on templase: Getting Started with Create React App and Fluent UI

Build Satus:
[![Azure Static Web Apps CI/CD](https://github.com/michalmar/hack-for-translation/actions/workflows/azure-static-web-apps-icy-bush-08c57d903.yml/badge.svg)](https://github.com/michalmar/hack-for-translation/actions/workflows/azure-static-web-apps-icy-bush-08c57d903.yml)

## Installation/setup:

- To install env for the API/Functions

    `pip install  -r api\requirements.txt`

- To install all nodes deps

    `npm install`

- TO install SWA (Static Web Apps CLI)
    `npm install -g @azure/static-web-apps-cli`

## Local Debug

- Runs the app and also asociated Azure Functions (apis) in debug mode.

    `swa start build --api-location api`

    > note: you need to run `npm run build` first
    > note: you need to install requirements.txt first to .venv, e.g.: `python -m pip install -r requirements.txt`

- Start the web app only

    `nvm use 16`
    
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



### fixing M1/M2 compatibility

based on: https://github.com/Azure/azure-functions-core-tools/issues/2834#issuecomment-1206135712

```
brew install python@3.9
brew uninstall azure-functions-core-tools@4
/opt/homebrew/bin/pip3 install grpcio
npm i -g azure-functions-core-tools@4.0.4483

!THIS DIDN'T WORK FOR ME! cp /opt/homebrew/lib/python3.9/site-packages/grpc/_cython/cygrpc.cpython-39-darwin.so /usr/local/lib/node_modules/azure-functions-core-tools/bin/workers/python/3.9/OSX/X64/grpc/_cython/cygrpc.cpython-39-darwin.so


cp /opt/homebrew/lib/python3.9/site-packages/grpc/_cython/cygrpc.cpython-39-darwin.so /Users/mimarusa/.swa/core-tools/v4/workers/python/3.9/OSX/X64/grpc/_cython/cygrpc.cpython-39-darwin.so


```

### Create Python VENV based on specific Python version

```
cd api
python3.9 -m venv .venv
source .venv/bin/activate
```
