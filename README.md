# smartclide-deployment-extension

The example of how to build the Theia-based applications with the smartclide-deployment-extension.

## Getting started

Install [nvm](https://github.com/creationix/nvm#install-script).

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash

Install npm and node.

    nvm install v12.18.3
    nvm use v12.18.3

Install yarn.

    npm install -g yarn

## Running the browser example

    yarn && yarn start:browser

_or:_

    yarn rebuild:browser
    cd browser-app
    yarn start

_or:_ launch `Start Browser Backend` configuration from VS code.

Open http://localhost:3000 in the browser.
