/* tslint:disable:only-arrow-functions */

import { expect } from 'chai'

describe('Game of life', function () {
  let subject: any

  before(function () {
    subject = require('./game-of-life')
  })

  describe('main', function () {
    it('should increment the board by generation', function () {
      const worldData = 'Generation 1:\n4 8\n........\n....*...\n...**...\n........\n\n'
      expect(subject.main(worldData)).to.equal('Generation 2:\n4 8\n........\n...**...\n...**...\n........\n\n')
    })

    it('should handle empty string', function () {
      expect(subject.main('')).to.equal('Generation 0:\n-1 -1\n\n')
    })

    it('should handle a 2x2 grid', function () {
      const worldData = 'Generation 1:\n2 2\n*.\n**\n\n'
      expect(subject.main(worldData)).to.equal('Generation 2:\n2 2\n**\n**\n\n')
    })
  })

  describe('worldToString', function () {
    it('should return an empty world string', function () {
      const world = { columns: 0, generation: 1, grid: [], rows: 0 }
      expect(subject.worldToString(world)).to.equal('Generation 1:\n0 0\n\n')
    })

    it('should return a valid world string', function () {
      const world = {
        columns: 8,
        generation: 1,
        grid: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        rows: 4
      }
      expect(subject.worldToString(world)).to.equal('Generation 1:\n4 8\n........\n....*...\n...**...\n........\n\n')
    })
  })

  describe('stringToWorld', function () {
    it('should return a world', function () {
      const input = 'Generation 1:\n4 8\n........\n....*...\n...**...\n........'
      const world = subject.stringToWorld(input)
      const expected = {
        columns: 8,
        generation: 1,
        grid: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        rows: 4
      }
      expect(world).to.deep.equal(expected)
    })

    it('should return an empty world', function () {
      expect(subject.stringToWorld('')).to.deep.equal({ generation: -1, rows: -1, columns: -1, grid: [] })
    })
  })

  describe('nextGeneration', function () {
    it('should return a new grid', function () {
      const newWorld = subject.nextGeneration({
        columns: 1,
        grid: [0],
        rows: 1
      })
      expect(newWorld.grid).to.have.lengthOf(1)
      expect(newWorld.rows).to.equal(1)
      expect(newWorld.columns).to.equal(1)
    })

    it('should kill single live cell in 1x1 grid', function () {
      const newWorld = subject.nextGeneration({
        columns: 1,
        grid: [1],
        rows: 1
      })
      expect(newWorld.grid).to.deep.equal([0])
    })

    it('should not revive single dead cell in 1x1 grid', function () {
      const newWorld = subject.nextGeneration({
        columns: 1,
        grid: [0],
        rows: 1
      })
      expect(newWorld.grid).to.deep.equal([0])
    })

    it('should kill single live cell in 2x2 grid', function () {
      const newWorld = subject.nextGeneration({
        columns: 2,
        grid: [0, 1, 0, 0],
        rows: 2
      })
      expect(newWorld.grid).to.deep.equal([0, 0, 0, 0])
    })

    it('should revive dead cell with 3 live neighbors', function () {
      const newWorld = subject.nextGeneration({
        columns: 2,
        grid: [1, 0, 1, 1],
        rows: 2
      })
      expect(newWorld.grid).to.deep.equal([1, 1, 1, 1])
    })

    it('should handle a large example', function () {
      const oldWorld = {
        columns: 8,
        generation: 1,
        grid: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        rows: 4
      }
      const newWorld = {
        columns: 8,
        generation: 2,
        grid: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        rows: 4
      }

      subject.nextGeneration(oldWorld)
      expect(subject.nextGeneration(oldWorld)).to.deep.equal(newWorld)
    })
  })

  describe('getLiveNeighbors', function () {
    it('should have no neighbors', function () {
      const world = { grid: [0], rows: 1, columns: 1 }
      expect(subject.getLiveNeighbors(0, world)).to.equal(0)
    })

    it('should have one live neighbor', function () {
      const world = { grid: [0, 1], rows: 1, columns: 2 }
      expect(subject.getLiveNeighbors(0, world)).to.equal(1)
    })

    it('should have no live neighbors', function () {
      const world = { grid: [0, 1], rows: 1, columns: 1 }
      expect(subject.getLiveNeighbors(1, world)).to.equal(0)
    })

    it('should have three neighbors', function () {
      expect(
        subject.getLiveNeighbors(11, {
          columns: 8,
          grid: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          rows: 4
        })
      ).to.equal(3)
    })
  })

  describe('nextCell', function () {
    describe('live cell', function () {
      it('should die with 1 live neighbor', function () {
        expect(subject.nextCell(1, 1)).to.equal(0)
      })

      it('should not die with 2 live neighbors', function () {
        expect(subject.nextCell(1, 2)).to.equal(1)
      })

      it('should not die with 3 live neighbors', function () {
        expect(subject.nextCell(1, 3)).to.equal(1)
      })

      it('should die with 4 live neighbors', function () {
        expect(subject.nextCell(1, 4)).to.equal(0)
      })
    })
    describe('dead cell', function () {
      it('should not revive with 1 live neighbor', function () {
        expect(subject.nextCell(0, 1)).to.equal(0)
      })

      it('should not revive with 2 live neighbors', function () {
        expect(subject.nextCell(0, 2)).to.equal(0)
      })

      it('should revive with 3 live neighbors', function () {
        expect(subject.nextCell(0, 3)).to.equal(1)
      })

      it('should not revive with 4 live neighbors', function () {
        expect(subject.nextCell(0, 4)).to.equal(0)
      })
    })
  })
})
