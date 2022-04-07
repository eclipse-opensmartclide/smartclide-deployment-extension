# Deployment-extension

The example of how to build the Theia-based applications with the deployment-extension.

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

## Running the watch mode

    1 yarn
    2 yarn start:browser
    3 split terminal
    4 yarn wacth

Open http://localhost:3000 in the browser.

## Publishing smartclide-deployment-widget-theia

Create a npm user and login to the npm registry, [more on npm publishing](https://docs.npmjs.com/getting-started/publishing-npm-packages).

    npm login

Publish packages with lerna to update versions properly across local packages, [more on publishing with lerna](https://github.com/lerna/lerna#publish).

    npx lerna publish
