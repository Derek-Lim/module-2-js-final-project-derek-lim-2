function GameBoard() {
  const board = []

  for (let i = 0; i < 3; i++) {
    board[i] = []
    for (let j = 0; j < 3; j++) {
      board[i][j] = Grid()
    }
  }

  const getBoard = () => board

  const placeMarker = (row, column, marker) => {
    board[row][column].markGrid(marker)
  }

  const printBoard = () => {
    for (const row of board) {
      console.log(
        `${row[0].getValue() === '' ? ' ' : row[0].getValue()}|${row[1].getValue() === '' ? ' ' : row[1].getValue()}|${row[2].getValue() === '' ? ' ' : row[2].getValue()}`,
      )
      console.log('-----')
    }
  }

  return { getBoard, printBoard, placeMarker }
}

function Grid() {
  let value = ''

  const getValue = () => value

  const markGrid = (marker) => {
    value = marker
  }

  return { getValue, markGrid }
}
