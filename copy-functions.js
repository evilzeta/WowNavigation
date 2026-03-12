const fs = require('fs')
const path = require('path')

function copyDir(s, d) {
  fs.mkdirSync(d, { recursive: true })
  fs.readdirSync(s).forEach(f => {
    const sp = path.join(s, f)
    const dp = path.join(d, f)
    fs.statSync(sp).isDirectory() ? copyDir(sp, dp) : fs.copyFileSync(sp, dp)
  })
}

copyDir('functions', 'dist/functions')
console.log('Functions copied to dist/functions')