import * as fs from 'fs'
import * as gameOfLife from './src/game-of-life'

function start () {
  const inputFile = process.argv[2]
  fs.readFile(inputFile, (err: Error, data: Buffer) => {
    if (err) {
      throw err
    }
    process.stdout.write(gameOfLife.main(data.toString()))
    process.exit(0)
  })
}

if (require.main === module) {
  start()
} else {
  module.exports = { start }
}
