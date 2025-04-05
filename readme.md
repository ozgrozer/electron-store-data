# electron-store-data
[![npm](https://img.shields.io/npm/v/electron-store-data.svg?style=flat-square)](https://www.npmjs.com/package/electron-store-data)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/ozgrozer/electron-store-data/blob/master/license)

A Node.js module to store [Electron](https://github.com/electron/electron) data in the computer.

## Installation
```sh
# npm
npm i electron-store-data

# pnpm
pnpm add electron-store-data

# yarn
yarn add electron-store-data
```

## Usage
```js
// include module
const Store = require('electron-store-data')

// initialize
const storeWindow = new Store({
  filename: 'window', // will be window.json
  defaults: {
    bounds: { x: '', y: '', width: 900, height: 500 }
  }
})

// get
console.log(storeWindow.get('bounds'))
// { x: '', y: '', width: 900, height: 500 }

// set
storeWindow.set('bounds', { x: 500, y: 200, width: 800, height: 450 })

// delete
storeWindow.delete('bounds')
```

## Encryption
```js
// initialize
const storeSubscription = new Store({
  filename: 'subscription',
  encryption: {
    enable: true,
    salt: 'XXX',
    password: 'XXX',
    keylen: '', // optional (default: 32)
    algorithm: '' // optional (default: aes-256-cbc)
  },
  defaults: {
    plan: 'basic',
    license: 'XXXX-XXXX-XXXX-XXXX'
  }
})
```

## Contribution
Feel free to contribute. Open a new [issue](https://github.com/ozgrozer/electron-store-data/issues), or make a [pull request](https://github.com/ozgrozer/electron-store-data/pulls).

## License
[MIT](https://github.com/ozgrozer/electron-store-data/blob/master/license)
