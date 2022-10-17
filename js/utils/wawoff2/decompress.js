'use strict'

const em_module = require('./build/decompress_binding.js')

module.exports = async function decompress (buffer) {
  await runtimeInit
  const result = em_module.decompress(buffer)
  if (result === false) throw new Error('ConvertWOFF2ToTTF failed')
  return result
}
