const electron = require('electron')
const path = require('path')
const fs = require('fs')

class Store {
  constructor (filename) {
    this.path = path.join((electron.app || electron.remote.app).getPath('userData'), filename + '.json')
    this.data = this.readFile()

    this.createFile()
  }

  readFile () {
    try {
      return JSON.parse(fs.readFileSync(this.path, 'utf8'))
    } catch (e) {
      return {}
    }
  }

  createFile () {
    if (!fs.existsSync(this.path)) {
      return this.writeFile()
    }
  }

  writeFile () {
    return fs.writeFileSync(this.path, JSON.stringify(this.data))
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
