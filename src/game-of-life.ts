type Cell = 0 | 1

interface IWorld {
  grid: Cell[]
  generation: number
  rows: number
  columns: number
}

export function main(worldData: string): string {
  return worldToString(nextGeneration(stringToWorld(worldData)))
}

export function worldToString(world: IWorld): string {
  return [
    stringifyGeneration(world.generation),
    stringifyDimensions(world.rows, world.columns),
    stringifyGrid(world.grid, world.rows, world.columns)
  ].join('\n')
}

function stringifyGeneration(generation: IWorld['generation']): string {
  return `Generation ${generation}:`
}

function stringifyDimensions(rows: IWorld['rows'], columns: IWorld['columns']): string {
  return `${rows} ${columns}`
}

function stringifyGrid(grid: IWorld['grid'], rows: IWorld['rows'], columns: IWorld['columns']): string {
  const output = []
  for (let r = 0; r < rows; r++) {
    output.push(
      grid
        .slice(r * columns, r * columns + columns)
        .map(cellToString)
        .join('')
    )
  }
  output.push('\n')
  return output.join('\n')
}

function cellToString(cell: Cell): string {
  return cell === 0 ? '.' : '*'
}

export function stringToWorld(worldString: string): IWorld {
  const lines = worldString.split('\n')
  const generation = parseGeneration(lines.shift() || '')
  const [rows, columns] = parseDimensions(lines.shift() || '')
  const grid = parseGrid(lines)
  return {
    columns,
    generation,
    grid,
    rows
  }
}

function parseGeneration(str: string): IWorld['generation'] {
  const words = str ? str.split(' ') : []
  return words.length > 1 ? parseInt(str.split(' ')[1], 10) : -1
}

function parseDimensions(str: string): Array<IWorld['rows'] | IWorld['columns']> {
  const words = str ? str.split(' ') : ['-1', '-1']
  return words.map(word => parseInt(word, 10))
}

function parseGrid(data: string[]): IWorld['grid'] {
  return data
    .join('')
    .split('')
    .map(stringToCell)
}

function stringToCell(str: string): Cell {
  return str === '.' ? 0 : 1
}

export function nextGeneration(world: IWorld): IWorld {
  const newGrid = new Array(world.grid.length)
  for (let i = 0; i < world.grid.length; i++) {
    newGrid[i] = nextCell(world.grid[i], getLiveNeighbors(i, world))
  }
  return {
    columns: world.columns,
    generation: world.generation + 1,
    grid: newGrid,
    rows: world.rows
  }
}

export function getLiveNeighbors(cellIndex: number, world: IWorld): number {
  let liveNeighbors = 0
  const cellRow = Math.floor(cellIndex / world.columns)
  const cellColumn = cellIndex % world.columns

  const indices: number[] = [cellRow * world.columns + cellColumn]

  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      const index = (cellRow + r) * world.columns + (cellColumn + c)
      // if (!indices.find((i: number) => i === index)) { // bug
      if (indices.find((i: number) => i === index) === undefined) { // correct
        if (isValidIndex(index, world.grid) && isLiveCell(world.grid[index])) {
          liveNeighbors++
          indices.push(index)
        }
      }
    }
  }

  return liveNeighbors
}

function isValidIndex(index: number, grid: IWorld['grid']): boolean {
  return index >= 0 && index < grid.length
}

function isLiveCell(cell: Cell): boolean {
  return cell === 1
}

export function nextCell(cell: number, liveNeighbors: number): Cell {
  switch (liveNeighbors) {
    case 2:
      return cell ? 1 : 0
    case 3:
      return 1
    default:
      return 0
  }
}
