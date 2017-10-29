# electron-store-data
[![npm](https://img.shields.io/npm/v/electron-store-data.svg?style=flat-square)](https://www.npmjs.com/package/electron-store-data)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/ozgrozer/electron-store-data/blob/master/license)

A Node.js module to store [Electron](https://github.com/electron/electron) datas in the computer.

## Usage
```js
const Store = require('electron-store-data')

// File created on file:///Users/{user-name}/Library/Application Support/{electron-app-name}/window.json (macOS).
const storeWindow = new Store('window')

storeWindow.set('width', '640')
console.log(storeWindow.get('width')) // 640
storeWindow.delete('width')

storeWindow.set('options', { 'width': '640', 'height': '480' })
console.log(storeWindow.get('options')) // { width: '640', height: '480' }
storeWindow.delete('options')
```

## Contribution
Feel free to contribute. Open a new [issue](https://github.com/ozgrozer/electron-store-data/issues), or make a [pull request](https://github.com/ozgrozer/electron-store-data/pulls).

## License
[MIT](https://github.com/ozgrozer/electron-store-data/blob/master/license)
