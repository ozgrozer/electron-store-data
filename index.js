const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const electron = require('electron')

const encrypt = ({ text, encryptionKey }) => {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv)
  let encrypted = cipher.update(text, 'utf8')
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

const decrypt = ({ encryptedText, encryptionKey }) => {
  try {
    const [ivHex, dataHex] = encryptedText.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const encrypted = Buffer.from(dataHex, 'hex')

    const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv)
    let decrypted = decipher.update(encrypted)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString('utf8')
  } catch (err) {
    console.log('Decryption failed:', err.message)
    return null
  }
}

class Store {
  constructor ({ filename, defaults = {}, encryption = {} }) {
    if (!filename) {
      throw new Error('No filename provided')
    }

    if (encryption.enable) {
      this.encryptionKey = crypto.scryptSync(
        encryption.password,
        encryption.salt,
        64
      )
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
