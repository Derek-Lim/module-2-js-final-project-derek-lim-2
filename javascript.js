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

  return { getBoard, placeMarker }
}

function Grid() {
  let value = ''

  const getValue = () => value

  const markGrid = (marker) => {
    value = marker
  }

  return { getValue, markGrid }
}

function GameController() {
  const board = GameBoard()

  const players = [
    {
      name: 'Player 1',
      marker: 'X'
    },
    {
      name: 'Player 2',
      marker: 'O'
    }
  ]

  let activePlayer = players[0]

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0]
  }

  const getActivePlayer = () => activePlayer

  const playRound = (selectedGrid) => {
    const [row, column] = selectedGrid.split('')
    board.placeMarker(row, column, activePlayer.marker)
    switchPlayerTurn()
  }

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard
  }
}
