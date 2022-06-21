# SmartCLIDE Deployment Extension

The example of how to build the Theia-based applications with the deployment-extension.

## Getting started

Install [nvm](https://github.com/creationix/nvm#install-script).

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash

Install npm and node.

    nvm install v12.22.11
    nvm use 12.22.11

Install yarn.

    npm install -g yarn

## Running the browser example

    yarn && yarn start:browser

_or:_

    yarn rebuild:browser
    cd browser-app
    yarn start

_or:_ launch `Start Browser Backend` configuration from VS code.

## Running the watch mode

    1 yarn
    2 yarn start:browser
    3 split terminal
    4 yarn wacth

Open http://localhost:3000 in the browser.

## Running the Electron example

    yarn start:electron

_or:_

    yarn rebuild:electron
    cd electron-app
    yarn start

_or:_ launch `Start Electron Backend` configuration from VS code.
