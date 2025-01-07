function GameBoard() {
  const board = Array.from(
    { length: 3 }, () => Array(3).fill(null).map(() => Grid())
  )

  const getBoard = () => board

  const placeMarker = (row, column, marker) => {
    board[row][column].markGrid(marker)
  }

  const clearBoard = () => {
    board.forEach((row, rowIndex) => {
      row.forEach((_, colIndex) => placeMarker(rowIndex, colIndex, ''))
    })
  }

  return { getBoard, placeMarker, clearBoard }
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
      marker: 'X',
      score: 0
    },
    {
      name: 'Player 2',
      marker: 'O',
      score: 0
    }
  ]

  let activePlayer = players[0]

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0]
  }

  const getActivePlayer = () => activePlayer

  const incrementScore = (player) => {
    player.score++
  }

  const changePlayerName = (id, name) => {
    if (id === 'player-one-form') {
      var playerIndex = 0
      var modal = document.getElementById('player-one-modal')
    } else {
      var playerIndex = 1
      var modal = document.getElementById('player-two-modal')
    }
    const otherPlayerIndex = 1 - playerIndex
  
    if (players[otherPlayerIndex].name.toLowerCase() !== name.toLowerCase()) {
      players[playerIndex].name = name
      bootstrap.Modal.getInstance(modal).hide()
      return true
    } else {
      alert(`Pick a different name from player ${otherPlayerIndex + 1}`)
      return false
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

  const resetGame = () => {
    board.clearBoard()
    matchOver = false
    activePlayer = players[0]
  }

  return {
    playRound,
    getActivePlayer,
    getMatchOver,
    getThreeInRow,
    changePlayerName,
    resetGame,
    incrementScore,
    getBoard: board.getBoard
  }
}

function ScreenController() {
  const game = GameController()
  const boardDiv = document.getElementById('board')
  const newMatchBtn = document.getElementById('new-match-btn')
  const playerOneModal = document.getElementById('player-one-modal')
  const playerTwoModal = document.getElementById('player-two-modal')
  const playerOneForm = document.getElementById('player-one-form')
  const playerTwoForm = document.getElementById('player-two-form')

  const updateScoreboardName = (id, newName) => {
    if (id === 'player-one-form') {
      const p1Small = document.getElementById('player-one-scoreboard-name-sm')
      const p1Large = document.getElementById('player-one-scoreboard-name-lg')
      p1Small.textContent = newName
      p1Large.textContent = newName
    } else {
      const p2Small = document.getElementById('player-two-scoreboard-name-sm')
      const p2Large = document.getElementById('player-two-scoreboard-name-lg')
      p2Small.textContent = newName
      p2Large.textContent = newName
    }
  }

  const updateInfoName = (id, name) => {
    const player = game.getActivePlayer()
    const infoDiv = document.getElementById('info')

    if (
      id === 'player-one-form' && player.marker === 'X' ||
      id === 'player-two-form' && player.marker === 'O'
    ) {
      if (!game.getMatchOver()) {
        infoDiv.textContent = `${name}'s turn`
      } else if (game.getThreeInRow()) {
        infoDiv.textContent = `${name} wins!`
      }
    }
  }

  const updateName = (e) => {
    e.preventDefault()

    const id = e.target.id
    const name = e.target.querySelector('input').value

    const nameChanged = game.changePlayerName(id, name)
    if (nameChanged) {
      updateScoreboardName(id, name)
      updateInfoName(id, name)
    }
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
      infoDiv.classList.remove('btn-danger', 'btn-secondary')
      infoDiv.classList.add('btn-primary')
    } else {
      infoDiv.classList.remove('btn-primary', 'btn-secondary')
      infoDiv.classList.add('btn-danger')
    }
  }

  const updateNewMatchBtn = () => {
    const newMatchBtn = document.getElementById('new-match-btn')
    if (game.getMatchOver()) {
      newMatchBtn.textContent = 'New Match'
      newMatchBtn.classList.remove('btn-info')
      newMatchBtn.classList.add('btn-success')
    } else {
      newMatchBtn.textContent = 'Restart Match'
      newMatchBtn.classList.remove('btn-success')
      newMatchBtn.classList.add('btn-info')
    }
  }

  const announceResult = (infoDiv, name, marker, winningGrids) => {
    if (winningGrids) {
      winningGrids.forEach(grid => {
        const gridBtn = document.querySelector(`[data-index='${grid}']`)
        gridBtn.classList.remove('btn-dark')
        if (marker === 'X') {
          gridBtn.classList.add('btn-primary')
        } else {
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

  const updateScoreboard = (player) => {
    if (player.marker === 'X') {
      const p1Small = document.getElementById('player-one-score-sm')
      const p1Large = document.getElementById('player-one-score-lg')
      p1Small.textContent = player.score
      p1Large.textContent = player.score
    } else {
      const p2Small = document.getElementById('player-two-score-sm')
      const p2Large = document.getElementById('player-two-score-lg')
      p2Small.textContent = player.score
      p2Large.textContent = player.score
    }
  }

  const handleMatchOver = (infoDiv, player) => {
    const winningGrids = game.getThreeInRow()

    if (winningGrids) {
      game.incrementScore(player)
      updateScoreboard(player)
    }
    announceResult(infoDiv, player.name, player.marker, winningGrids)
  }

  const updateScreen = () => {
    const infoDiv = document.getElementById('info')
    const player = game.getActivePlayer()

    renderBoard()
    updateNewMatchBtn()
  
    if (game.getMatchOver()) {
      handleMatchOver(infoDiv, player)
    } else {
      updateTurn(infoDiv, player.name, player.marker)
    }
  }

  const newMatch = () => {
    game.resetGame()
    updateScreen()
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
  newMatchBtn.addEventListener('click', newMatch)
  playerOneForm.addEventListener('submit', updateName)
  playerTwoForm.addEventListener('submit', updateName)
  playerOneModal.addEventListener('hidden.bs.modal', (e) => {
    playerOneForm.querySelector('input').value = ''
  })
  playerTwoModal.addEventListener('hidden.bs.modal', (e) => {
    playerTwoForm.querySelector('input').value = ''
  })

  updateScreen()
}

ScreenController()
