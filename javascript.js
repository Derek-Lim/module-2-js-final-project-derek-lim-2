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

  const changePlayerName = (e) => {
    e.preventDefault()
    const name = e.target.querySelector('input').value

    if (e.target.id === 'player-one-form') {
      players[0].name = name
      bootstrap.Modal
        .getInstance(document.getElementById('player-one-modal'))
        .hide()
    } else if (e.target.id === 'player-two-form') {
      players[1].name = name
      bootstrap.Modal
      .getInstance(document.getElementById('player-two-modal'))
      .hide()
    }
  }

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
    changePlayerName,
    getBoard: board.getBoard
  }
}

function ScreenController() {
  const game = GameController()
  const boardDiv = document.getElementById('board')
  const playerOneForm = document.getElementById('player-one-form')
  const playerTwoForm = document.getElementById('player-two-form')

  const updateScoreboardName = (e) => {
    e.preventDefault()
    const name = e.target.querySelector('input').value

    if (e.target.id === 'player-one-form') {
      const p1Small = document.getElementById('player-one-scoreboard-name-sm')
      const p1Large = document.getElementById('player-one-scoreboard-name-lg')
      p1Small.textContent = name
      p1Large.textContent = name
    } else if (e.target.id === 'player-two-form') {
      const p2Small = document.getElementById('player-two-scoreboard-name-sm')
      const p2Large = document.getElementById('player-two-scoreboard-name-lg')
      p2Small.textContent = name
      p2Large.textContent = name
    }
  }

  const updateName = (e) => {
    game.changePlayerName(e)
    updateScoreboardName(e)
    updateScreen()
  }

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
  
  const updateTurn = (infoDiv, name, marker) => {
    infoDiv.textContent = `${name}'s turn`  
    if (marker === 'X') {
      infoDiv.classList.remove('btn-danger')
      infoDiv.classList.add('btn-primary')
    } else if (marker === 'O') {
      infoDiv.classList.remove('btn-primary')
      infoDiv.classList.add('btn-danger')
    }
  }
  
  const announceResult = (infoDiv, name, marker) => {
    const winningGrids = game.getThreeInRow()

    if (winningGrids) {
      winningGrids.forEach(grid => {
        const gridBtn = document.querySelector(`[data-index='${grid}']`)
        gridBtn.classList.remove('btn-dark')
        if (marker === 'X') {
          gridBtn.classList.add('btn-primary')
        } else if (marker === 'O') {
          gridBtn.classList.add('btn-danger')
        }
      })
      infoDiv.textContent = `${name} wins!`
    } else {
      infoDiv.textContent = 'Draw'
      infoDiv.classList.remove('btn-primary', 'btn-danger')
      infoDiv.classList.add('btn-secondary')
    }
  }

  const updateScreen = () => {
    const infoDiv = document.getElementById('info')
    const name = game.getActivePlayer().name
    const marker = game.getActivePlayer().marker

    renderBoard()
  
    if (game.getMatchOver()) {
      announceResult(infoDiv, name, marker)
    } else {
      updateTurn(infoDiv, name, marker)
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
  playerOneForm.addEventListener('submit', updateName)
  playerTwoForm.addEventListener('submit', updateName)

  updateScreen()
}

ScreenController()
