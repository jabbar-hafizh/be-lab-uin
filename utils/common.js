import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import moment from 'moment'

const algorithm = 'aes-256-ctr'
const JWT_KEY = process.env.JWT_KEY ? process.env.JWT_KEY : 'j!J@W#w$t%T^'

import { accent_map, latin_map } from './string.js'

let privateKey = process.env.PWD_KEY

export function decrypt(password) {
  const decipher = crypto.createDecipher(algorithm, privateKey)
  let dec = decipher.update(password, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}

export function encrypt(password, salt) {
  if (!password || !salt) {
    throw new Error('password & salt required')
  }

  if (typeof password !== 'string') {
    password = String(password)
  }

  try {
    return crypto.createHmac('sha1', salt).update(password).digest('hex')
  } catch (err) {
    throw new Error('Encryption Failed')
  }
}

export function compare(strInput, strDatabase, salt) {
  let encryptedInput = encrypt(strInput, salt)
  return encryptedInput === strDatabase
}

export function makeSalt() {
  return Math.round(new Date().valueOf() * Math.random()) + ''
}

export function getToken(tokenData, expiresIn) {
  let tokenExpiration

  if (expiresIn) {
    tokenExpiration = {
      expiresIn: expiresIn ? expiresIn : '18h'
    }
  }

  let secretKey = process.env.JWT_KEY || JWT_KEY
  return jwt.sign(tokenData, secretKey, tokenExpiration)
}

export function getUserId(token) {
  let secretKey = process.env.JWT_KEY || JWT_KEY
  var tokenDecode = jwt.verify(token, secretKey)
  return tokenDecode._id
}

export function getJwtDecode(token, ignoreExpiration) {
  let secretKey = process.env.JWT_KEY || JWT_KEY
  var tokenDecode = jwt.verify(token, secretKey, { ignoreExpiration: ignoreExpiration === true })
  return tokenDecode
}

export const latinise = function (str) {
  return str.replace(/[^A-Za-z0-9[\] ]/g, function (a) {
    return latin_map[a] || a
  })
}

export function simpleDiacriticSensitiveRegex(string = '') {
  return string
    .replace(/a/g, '[a,á,à,ä]')
    .replace(/e/g, '[e,é,ë,è]')
    .replace(/i/g, '[i,í,ï,Î,î]')
    .replace(/o/g, '[o,ó,ö,ò,ô]')
    .replace(/u/g, '[u,ü,ú,ù]')
    .replace(/ /g, '[ ,-]')
}

export function diacriticSensitiveRegex(string = '', joinWordAsAlternative = true) {
  string = latinise(string)

  string = string.replace(/([|()[{.+*?^$\\])/g, '\\$1')

  let words = string.split(/\s+/)

  let accent_replacer = chr => {
    return accent_map[chr.toUpperCase()] || chr
  }

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].replace(/\S/g, accent_replacer)
  }

  let regexp
  if (joinWordAsAlternative) {
    regexp = words.join('|')
  } else {
    regexp = words.join('')
  }

  return new RegExp(regexp, 'g')
}

export const passwordPattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,72})')

export function formatDateFromDateOnly(dateObj) {
  let year = dateObj.getFullYear()
  let month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  let date = (dateObj.getDate() + 0).toString().padStart(2, '0')
  return `${year}-${month}-${date}`
}

export function formatDateFromDateOnlyToDDMMYYYY(dateObj) {
  const originalDate = String(dateObj)

  if (originalDate.length === 8) {
    const year = originalDate.substring(0, 4)
    const month = originalDate.substring(4, 6)
    const day = originalDate.substring(6, 8)
    return moment(new Date(year, month, day)).format('DD/MM/YYYY')
  }
}

export function formatDate(date, format) {
  format = format.toLowerCase()

  if (!date) {
    date = new Date()
  }

  if (typeof date === 'string') {
    date = new Date(date)
  }

  if (typeof date === 'object' && date.year) {
    date = new Date(date.year, date.month, date.date)
  }

  if (format === 'dd-mm-yyyy') {
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getFullYear()}`
  } else if (format === 'ddmmyyyy') {
    return `${date.getDate().toString().padStart(2, '0')}${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${date.getFullYear()}`
  } else {
    return date
  }
}

export function validateEmail(email) {
  var re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zAZ]{2,}))$/
  return re.test(email)
}

export function convertDateFromEpochTime(epoch_time = Date.now(), format = 'DD/MM/YYYY HH:mm') {
  return moment(epoch_time).format(format)
}

export function convertDateToEpochTime(
  date = moment().format('DD/MM/YYYY HH:mm'),
  format = 'DD/MM/YYYY HH:mm'
) {
  return moment(date, format).valueOf()
}
