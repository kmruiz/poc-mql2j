const process = require('process')
const fs = require('fs')
const jsonString = fs.readFileSync(process.stdin.fd, 'utf-8')
const json = eval("(" + jsonString + ")")

const emit = require('./backend/java/emit')
const javaCode = emit(json, { verbosity: 'static import', wildcardImport: 'false', printImports: 'true' })

console.log(javaCode)