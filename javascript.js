function GameBoard() {
  const board = Array.from(
    { length: 3 }, () => Array(3).fill(null).map(() => Grid())
  )

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

  let matchOver = false

  const getMatchOver = () => matchOver

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

  const getThreeInRow = () => {
    const winningLines = [
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],
    ]

    for (const line of winningLines) {
      const [pos1, pos2, pos3] = line
      const val1 = board.getBoard()[pos1[0]][pos1[1]].getValue()
      const val2 = board.getBoard()[pos2[0]][pos2[1]].getValue()
      const val3 = board.getBoard()[pos3[0]][pos3[1]].getValue()
      if (val1 === val2 && val2 === val3 && (val1 === 'X' || val1 === 'O')) {
        return line.map(pos => pos.join(''))
      }
    }
    return null
  }

  const playRound = (selectedGrid) => {
    const [row, column] = selectedGrid.split('')
    const grid = document.querySelector(`[data-index='${selectedGrid}']`)
    if (grid.textContent === '') {
      board.placeMarker(row, column, activePlayer.marker)

      const hasThreeInRow = getThreeInRow()
      const boardFull = board.getBoard().flat().every(
        grid => grid.getValue() !== ''
      )
      if (hasThreeInRow || boardFull) matchOver = true

      if (!matchOver) switchPlayerTurn()
    }
  }

  return {
    playRound,
    getActivePlayer,
    getMatchOver,
    getThreeInRow,
    getBoard: board.getBoard
  }
}

function ScreenController() {
  const game = GameController()
  const boardDiv = document.getElementById('board')

  const renderBoard = () => {
    const board = game.getBoard()

    boardDiv.textContent = ''

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
  
  const updateTurn = (playerTurnDiv, playerName) => {
    playerTurnDiv.textContent = `${playerName}'s turn`  
    if (playerName === 'Player 1') {
      playerTurnDiv.classList.remove('btn-danger')
      playerTurnDiv.classList.add('btn-primary')
    } else if (playerName === 'Player 2') {
      playerTurnDiv.classList.remove('btn-primary')
      playerTurnDiv.classList.add('btn-danger')
    }
  }
  
  const handleMatchOver = (playerTurnDiv, playerName) => {
    const winningGrids = game.getThreeInRow()

    if (winningGrids) {
      winningGrids.forEach(grid => {
        const gridBtn = document.querySelector(`[data-index='${grid}']`)
        gridBtn.classList.remove('btn-dark')
        if (playerName === 'Player 1') {
          gridBtn.classList.add('btn-primary')
        } else {
          gridBtn.classList.add('btn-danger')
        }
      })
      playerTurnDiv.textContent = `${playerName} wins!`
    } else {
      playerTurnDiv.textContent = 'Draw'
      playerTurnDiv.classList.remove('btn-primary', 'btn-danger')
      playerTurnDiv.classList.add('btn-secondary')
    }
  }

  const updateScreen = () => {
    const playerTurnDiv = document.getElementById('turn')
    const playerName = game.getActivePlayer().name

    renderBoard()
  
    if (game.getMatchOver()) {
      handleMatchOver(playerTurnDiv, playerName)
    } else {
      updateTurn(playerTurnDiv, playerName)
    }
  }

  function clickHandlerBoard(e) {
    if (!game.getMatchOver()) {
      const selectedGrid = e.target.dataset.index
      if (!selectedGrid) return
      game.playRound(selectedGrid)
      updateScreen()
    }
  }
  boardDiv.addEventListener('click', clickHandlerBoard)

  updateScreen()
}

ScreenController()
