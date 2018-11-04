#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function join(array, sep) {
  return array.map(i => `${i}${sep}`).join('')
}

function isDirectory(path) {
  const stats = fs.statSync(path)
  return stats.isDirectory()
}

function isNotIndex(path) {
  return path !== 'index.js'
}

function removeSuffix($path) {
  const suffix = /\.js$/
  return path.basename($path).replace(suffix, '')
}

function getModules(dir) {
  return fs
    .readdirSync(dir)
    .filter(isNotIndex)
    .map(f => path.resolve(dir, f))
}

function updateIndex(dir) {
  const modules = getModules(dir)
  const imports = []
  const exports = []
  const exportDefault = []
  modules.forEach(modulePath => {
    const moduleName = removeSuffix(modulePath)
    imports.push(`import ${moduleName} from './${moduleName}'`)
    exports.push(`export { default as ${moduleName} } from './${moduleName}'`)
    exportDefault.push(`  ${moduleName}`)

    if (isDirectory(modulePath)) {
      updateIndex(modulePath)
    }
  })

  const entry = path.join(dir, 'index.js')
  const $imports = `${join(imports, '\n')}\n`
  const $exports = `${join(exports, '\n')}\n`
  const $exportDefault = `export default {\n${join(exportDefault, ',\n')}}\n`
  fs.writeFileSync(entry, `${$imports}${$exports}${$exportDefault}`)
}

const srcDir = path.resolve(__dirname, '../src')
updateIndex(srcDir)
