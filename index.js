const path = require('path')
const electron = require('electron')
const fs = require('fs')
const mkdirp = require('mkdirp')

class Store {
  constructor (opts) {
    this.rootFolder = (electron.app || electron.remote.app).getPath('userData')
    this.fullPath = path.join(this.rootFolder, 'data', `${this.filename}.json`)
    this.data = this.readFile(opts.defaults) || {}
  }

  readFile (defaults) {
    try {
      return JSON.parse(fs.readFileSync(this.fullPath, 'utf8'))
    } catch (e) {
      return defaults
    }
  }

  writeFile () {
    return fs.writeFileSync(this.fullPath, JSON.stringify(this.data))
  }

  get (key) {
    return this.data[key]
  }

  set (key, val) {
    this.data[key] = val
    return this.writeFile()
  }

  delete (key) {
    delete this.data[key]
    return this.writeFile()
  }
}

module.exports = Store
