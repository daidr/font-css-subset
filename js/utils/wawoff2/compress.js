'use strict'

const em_module = require('./build/compress_binding.js')

module.exports = async function compress (buffer) {
  const result = em_module.compress(buffer)
  if (result === false) throw new Error('ConvertTTFToWOFF2 failed')
  return result
}
