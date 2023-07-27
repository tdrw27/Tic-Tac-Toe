const body = document.querySelector('body');

const Player = (nameInput, markerInput) => {
  let name = nameInput;
  let marker = markerInput;

  const getName = () => name;

  const setName = newName => name = newName;

  const getMarker = () => marker;

  const setMarker = newMarker => marker = newMarker 

  return {
    getName,
    getMarker,
    setName,
    setMarker
  }
};
const testP1 = Player('P1', 'X')
const testP2 = Player('P2', 'O')



const gameBoard = (() => {
  let _currentBoard = Array(9).fill(null);
  
  const setBoard = board => _currentBoard = board;

  const setMarker = (click, player) => {
    // Corresponding square clicked on screen
    const boardTarget = Number(click.target.attributes['data-location'].value)
    
    // Creating new board from current board
    // If the index of new boards square is 
    // the square clicked on screen (boardTarget)
    // that value becomes the players marker if no marker exists
    // else swaps turn back to current player
    if (_currentBoard[boardTarget] !== null) return 0
    
    const newBoard = _currentBoard.map((value, index) => 
    index === boardTarget ? 
    player.getMarker() : 
    value
    )
    return setBoard(newBoard)
  }
  
  const getBoard = () => _currentBoard;
  
  const getSquareVal = index => _currentBoard[index];
  
  const resetBoard = () => setBoard(Array(9).fill(null));
  
  return {
    getBoard,
    setMarker,
    getSquareVal,
    resetBoard
  }
})();

const ai = (() => {
  const play = difficulty => {
    let board = gameBoard.getBoard();
    let openSpots = board.map((val, index) => val === null ? index : val).filter(e => typeof e === 'number')
    let randomSpot = openSpots[Math.floor(Math.random() * openSpots.length)]
    if (difficulty == 'Easy') {
      let clickEvt = {
        target: {
          attributes: {
            'data-location': {
              value: randomSpot
            }
          }
        }
      }
      console.log('in ai func >>>');
      gameBoard.setMarker(clickEvt, game.getCurrentPlayer())
    }
  }

  return {
    play,
  }
})()

const displayController = (() => {
  const renderBoard = boardArr => {
    const boardNodes = boardArr.map((item, index) => {
      const square = document.createElement('div');
      square.classList.add('boardSquare');
      square.innerText = item;
      square.setAttribute('data-location', index);
      return square
    });
    
    const boardWrapper = document.createElement('main');
    boardWrapper.classList.add('board');
    boardWrapper.addEventListener('click', (e) => {
      game.playTurn(e)
    });
    
    for (let node of boardNodes) {
      boardWrapper.appendChild(node);
    }

    if (body.contains(body.querySelector('.board'))) {
      body.replaceChild(boardWrapper, body.querySelector('.board'))
    }
    body.appendChild(boardWrapper)
  };


  const renderPlayerNames = (player1, player2) => {
    const namesWrapper = document.createElement('div');
    namesWrapper.classList.add('namesWrapper');
    const players = [player1, player2]
    
    for (let player of players) {
      const nameDiv = document.createElement('input');
      nameDiv.setAttribute('type', 'text');
      nameDiv.classList.add('playerName');
      nameDiv.value = player.getName();
      nameDiv.addEventListener('change', e => {
        player.setName(e.target.value)
      });
      namesWrapper.appendChild(nameDiv);
    }
    if (body.contains(body.querySelector('.namesWrapper'))) {
      body.querySelector('.namesWrapper').replaceWith(namesWrapper);
    }
    else {
      body.appendChild(namesWrapper)
    }
  };

  const renderResult = player => {
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('resultDiv')
    resultDiv.textContent = player ? `${player.getName()} has won the game!` : 'Tie Game!'
    resultDiv.addEventListener('click', () => {
      game.resetGame()
      body.removeChild(body.querySelector('.resultDiv'));
    })

    if (!body.contains(body.querySelector('.resultDiv'))) {
      body.appendChild(resultDiv);
    }
  }

  const renderAiSelect = () => {
    const aiSelect = document.createElement('div');
    aiSelect.classList.add('ai-dropdown');
    aiSelect.addEventListener('click', () => {
      document.querySelector('.dropdown-content').classList.toggle('show')
      document.querySelector('.ai-dropdown button').classList.toggle('active')
    })

    const dropdownBtn = document.createElement('button')
    dropdownBtn.textContent = 'A.I.';
    const dropdownContent = document.createElement('div')
    dropdownContent.classList.add('dropdown-content');

    const selections = ['Easy', 'Medium', 'Impossible'];
    for (let selection of selections) {
      let option = document.createElement('a');
      option.setAttribute('href', '#');
      option.classList.add('dropdown-option')
      option.textContent = selection;
      option.addEventListener('click', game.setAi)
      dropdownContent.appendChild(option);
    }
    aiSelect.appendChild(dropdownBtn);
    aiSelect.appendChild(dropdownContent);
    document.querySelectorAll('.playerName')[1].insertAdjacentElement('afterend', aiSelect)
  }

  return {
    renderBoard,
    renderResult,
    renderPlayerNames,
    renderAiSelect,
  }
})();

const game = ((player1, player2) => {
  const _p1 = player1;
  let _p2 = player2;

  let _currentPlayer = _p1;

  const getCurrentPlayer = () => _currentPlayer;

  const nextPlayer = () => {
    _currentPlayer === _p1 ?
      _currentPlayer = _p2 : 
      _currentPlayer = _p1 ;
  }

  const setAi = click => {
    _p2 = Player('Computer', 'O')
    _p2.difficulty = click.target.innerText;
    displayController.renderPlayerNames(_p1, _p2);
    displayController.renderAiSelect()
    console.log({click, _p2});
  }

  const nextRound = () => displayController.renderBoard(gameBoard.getBoard());

  // Initialize game 
  const startGame = () => {
    displayController.renderPlayerNames(_p1, _p2);
    displayController.renderAiSelect()
    nextRound();
    
  }

  const _wonGame = (player) => displayController.renderResult(player);

  const _checkWinner = (player1, player2) => {
    const marker1 = player1.getMarker();
    const marker2 = player2.getMarker();
    const winningLines = [
      //Across
      [0,1,2],
      [3,4,5],
      [6,7,8],
      //Veritcal
      [0,3,6],
      [1,4,7],
      [2,5,8],
      //Diagonal
      [0,4,8],
      [2,4,6]
    ]

    // Checking each winning line for all of the same marker
    for (let line of winningLines) {
      if (marker1 === gameBoard.getSquareVal(line[0]) &&
          marker1 === gameBoard.getSquareVal(line[1]) &&
          marker1 === gameBoard.getSquareVal(line[2])) {
            return _wonGame(player1)
      }
      else if (marker2 === gameBoard.getSquareVal(line[0]) &&
               marker2 === gameBoard.getSquareVal(line[1]) &&
               marker2 === gameBoard.getSquareVal(line[2])) {
                  return _wonGame(player2)
      }
    }

    // checking for tie
    // If no empty spaces and no winner then result is tie
    if (!gameBoard.getBoard().includes(null)) {
      displayController.renderResult()
    }
  };

  const playTurn = click => {
    // Early return if clicked occupied spot
    if (gameBoard.setMarker(click, _currentPlayer) === 0) return
    if (Object.hasOwn(_p2, 'difficulty')) {
      _checkWinner(_p1, _p2)
      nextRound()
      nextPlayer()
      ai.play(_p2.difficulty)
    }
    _checkWinner(_p1, _p2)
    nextRound()
    nextPlayer()
  };

  const resetGame = () => {
    gameBoard.resetBoard()
    nextRound();
    _currentPlayer = _p1;
  };


  return {
    playTurn,
    getCurrentPlayer,
    startGame,
    resetGame,
    nextRound,
    nextPlayer,
    setAi,
  }
})(testP1, testP2);



game.startGame()