/* tslint:disable:only-arrow-functions */

import { expect } from 'chai'

describe('Game of life', function () {
  let subject: any

  before(function () {
    subject = require('./game-of-life')
  })

  describe('main', function () {
    // this test on its own generates substantial coverage
    it('should increment the board by generation', function () {
      const worldData = 'Generation 1:\n4 8\n........\n....*...\n...**...\n........\n\n'
      expect(subject.main(worldData)).to.equal('Generation 2:\n4 8\n........\n...**...\n...**...\n........\n\n')
    })

    // adding this test will bring us to 100% coverage
    // it('should handle empty string', function () {
    //   expect(subject.main('')).to.equal('Generation 0:\n-1 -1\n\n')
    // })

    // adding this test catches the bug in game-of-life.ts
    // it('should handle a 2x2 grid', function () {
    //   const worldData = 'Generation 1:\n2 2\n*.\n**\n\n'
    //   expect(subject.main(worldData)).to.equal('Generation 2:\n2 2\n**\n**\n\n')
    // })
  })
})
