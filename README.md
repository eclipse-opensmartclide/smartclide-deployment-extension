# smartclide-deployment-extension

The example of how to build the Theia-based applications with the smartclide-deployment-extension.

## Getting started

Install [nvm](https://github.com/creationix/nvm#install-script).

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash

Install npm and node.

    nvm install 12.18.3
    nvm use 12.18.3

Install yarn.

    npm install -g yarn

## Running the browser example

    yarn start:browser

_or:_

    yarn rebuild:browser
    cd browser-app
    yarn start

_or:_ launch `Start Browser Backend` configuration from VS code.

Open http://localhost:3000 in the browser.

## Running the Electron example

    yarn start:electron

_or:_

    yarn rebuild:electron
    cd electron-app
    yarn start

_or:_ launch `Start Electron Backend` configuration from VS code.

## Running the tests

    yarn test

_or_ run the tests of a specific package with

    cd smartclide
    yarn test

## Developing with the browser example

Start watching all packages, including `browser-app`, of your application with

    yarn watch

_or_ watch only specific packages with

    cd smartclide
    yarn watch

and the browser example.

    cd browser-app
    yarn watch

Run the example as [described above](#Running-the-browser-example)

## Developing with the Electron example

Start watching all packages, including `electron-app`, of your application with

    yarn watch

_or_ watch only specific packages with

    cd smartclide
    yarn watch

and the Electron example.

    cd electron-app
    yarn watch

Run the example as [described above](#Running-the-Electron-example)

## Publishing smartclide

Create a npm user and login to the npm registry, [more on npm publishing](https://docs.npmjs.com/getting-started/publishing-npm-packages).

    npm login

Publish packages with lerna to update versions properly across local packages, [more on publishing with lerna](https://github.com/lerna/lerna#publish).

    npx lerna publish
