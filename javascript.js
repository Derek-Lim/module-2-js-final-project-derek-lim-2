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
    const grid = document.querySelector(`[data-index='${selectedGrid}']`)
    if (grid.textContent === '') {
      board.placeMarker(row, column, activePlayer.marker)
      switchPlayerTurn()
    }
  }

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard
  }
}

function ScreenController() {
  const game = GameController()
  const playerTurnDiv = document.getElementById('turn')
  const boardDiv = document.getElementById('board')

  const updateScreen = () => {
    boardDiv.textContent = ''

    const board = game.getBoard()
    const activePlayer = game.getActivePlayer()

    playerTurnDiv.textContent = `${activePlayer.name}'s turn`
    if (activePlayer.name === 'Player 1') {
      playerTurnDiv.classList.remove('btn-danger')
      playerTurnDiv.classList.add('btn-primary')
    } else if (activePlayer.name === 'Player 2') {
      playerTurnDiv.classList.remove('btn-primary')
      playerTurnDiv.classList.add('btn-danger')
    }

    board.forEach((row, rowIndex) => {
      row.forEach((grid, colIndex) => {
        const gridBtn = document.createElement('button')
        gridBtn.classList.add('btn', 'btn-dark', 'grid')
        gridBtn.dataset.index = `${rowIndex}${colIndex}`
        gridBtn.textContent = grid.getValue()
        boardDiv.appendChild(gridBtn)
      })
    })
  }

  function clickHandlerBoard(e) {
    const selectedGrid = e.target.dataset.index

    if (!selectedGrid) return

    game.playRound(selectedGrid)
    updateScreen()
  }
  boardDiv.addEventListener('click', clickHandlerBoard)

  updateScreen()
}

ScreenController()
