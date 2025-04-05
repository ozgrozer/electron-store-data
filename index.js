const fs = require('fs')
const path = require('path')
const electron = require('electron')

class Store {
  constructor ({ filename, defaults = {} }) {
    if (!filename) {
      throw new Error('No filename provided')
    }
    this.rootFolder = (electron.app || electron.remote.app).getPath('userData')
    this.dataFolder = path.join(this.rootFolder, 'data')
    this.fullPath = path.join(this.dataFolder, `${filename}.json`)
    this.data = this.readFile(defaults) || {}
  }

  readFile (defaults) {
    try {
      return JSON.parse(fs.readFileSync(this.fullPath, 'utf8'))
    } catch (e) {
      return defaults
    }
  }

  writeFile () {
    if (!fs.existsSync(this.dataFolder)) fs.mkdirSync(this.dataFolder)
    return fs.writeFileSync(this.fullPath, JSON.stringify(this.data))
  }

  get (key) {
    return key ? this.data[key] : this.data
  }

  set (key, val) {
    if (!key) {
      this.data = val
    } else {
      this.data[key] = val
    }
    return this.writeFile()
  }

  delete (key) {
    if (!key) {
      try {
        fs.unlinkSync(this.fullPath)
        this.data = {}
        return true
      } catch (e) {
        return false
      }
    } else {
      delete this.data[key]
      return this.writeFile()
    }
  }
}

module.exports = Store
