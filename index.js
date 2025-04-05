const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const electron = require('electron')

const encrypt = ({ text, algorithm, encryptionKey }) => {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv)
  let encrypted = cipher.update(text, 'utf8')
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

const decrypt = ({ algorithm, encryptedText, encryptionKey }) => {
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
      this.algorithm = encryption.algorithm || 'aes-256-cbc'
      this.encryptionKey = crypto.scryptSync(
        encryption.password,
        encryption.salt,
        encryption.keylen || 64
      )
    }

    this.rootFolder = (electron.app || electron.remote.app).getPath('userData')
    this.dataFolder = path.join(this.rootFolder, 'data')
    this.fullPath = path.join(this.dataFolder, `${filename}.json`)
    this.data = this.readFile(defaults) || {}
  }

  readFile (defaults) {
    try {
      let fileContent = fs.readFileSync(this.fullPath, 'utf8')

      if (this.encryptionKey) {
        fileContent = decrypt({
          algorithm: this.algorithm,
          encryptedText: fileContent,
          encryptionKey: this.encryptionKey
        })

        if (fileContent === null) {
          return defaults
        }
      }

      return JSON.parse(fileContent)
    } catch (e) {
      return defaults
    }
  }

  writeFile () {
    if (!fs.existsSync(this.dataFolder)) fs.mkdirSync(this.dataFolder)

    let dataToWrite = JSON.stringify(this.data)

    if (this.encryptionKey) {
      dataToWrite = encrypt({
        text: dataToWrite,
        algorithm: this.algorithm,
        encryptionKey: this.encryptionKey
      })
    }

    return fs.writeFileSync(this.fullPath, dataToWrite)
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
