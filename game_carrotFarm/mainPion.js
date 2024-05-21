'use strict';

const timerbox = document.querySelector('.timerbox');
const gameTimer = document.querySelector('.game__timer');
const buttonBox = document.querySelector('.button__box');
const buttonInTimer = document.querySelector('.button__in-timer');
const buttonInResult = document.querySelector('.button__in-result');
const iconButton = document.querySelector('i');
const displayCountBugKill = document.querySelector('.displaycount__bugkill')
const gameGround = document.querySelector('.gameground');
const gameResultBox = document.querySelector('.game__result-box');
const gameResultMessage = document.querySelector('.game__result-message')
const audioBg = new Audio('./sound/bg.mp3');
const audioBugKill = new Audio('./sound/bug_cut.mp3');
const audioCarrotSelect = new Audio('./sound/carrot_pull.mp3');
const audioYouWin = new Audio('./sound/game_win.mp3');
const audioYouLost = new Audio('./sound/alert.wav');

let timerInitialize;
let gameDurationSec = 10;

let countBugKill = 10;
generatorObjects('carrot');
generatorObjects('bug');

buttonInTimer.addEventListener('click', () => {
  if (iconButton.classList.contains('fa-play')) {
    startGame();
  } else if (iconButton.classList.contains('fa-stop')) {
    stopGame();
  }
})
buttonInResult.addEventListener('click', () => {
  replayGame();
})

function startGame () {
  startTimer();
  ChangeButtonIcon();
  bugkills();
  playSound(audioBg);
}

function replayGame () {
  gameGround.innerHTML = '';
  displayGameResultBox('hidden');
  displayButtonBox('visible');
  resetValue();
  startTimer();
  generatorObjects('carrot');
  generatorObjects('bug');
  playSound(audioBg);
}

function resetValue () {
  countBugKill = 10;
  displayCountBugKill.textContent = countBugKill;
}

function ChangeButtonIcon () {
    iconButton.classList.remove('fa-play');
    iconButton.classList.add('fa-stop');
};

function displayButtonBox (order) {
  const orderDisplayButtonBox = order;
  if (orderDisplayButtonBox === 'visible') {
    buttonBox.style.visibility = 'visible';
  } else if (orderDisplayButtonBox === 'hidden') {
    buttonBox.style.visibility = 'hidden';
  };
}

function timerSetting (remainingTimeSec) {
  let minutes = Math.floor(remainingTimeSec / 60);
  let seconds = remainingTimeSec % 60;
  gameTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer () {
  let remainingTimeSec = gameDurationSec;
  timerSetting(remainingTimeSec);
  timerInitialize = setInterval(function() {
    timerSetting(--remainingTimeSec);
    if (remainingTimeSec === 0) {
      gameResult('lost')
    };
  }, 1000);
}

function generatorObjects(objectName) {
  let objects = objectName;
  let minX = 0;
  let minY = 0;
  for (let i = 0; i < 10; i++) {
    objects = document.createElement('img');
    objects.setAttribute('class', `${objectName}`);
    objects.src = `./img/${objectName}.png`;
    objects.alt = `${objectName}${i}`;
    objects.setAttribute('data-id', `${objectName}-${i}`);
    let maxX = gameGround.clientWidth - (objects.width + 40);
    let maxY = gameGround.clientHeight - (objects.height + 40);
    let randomX = Math.floor(Math.random()*(maxX - minX + 1)) + minX;
    let randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
    objects.style.position = 'absolute';
    objects.style.left = randomX + 'px';
    objects.style.top = randomY + 'px';
    gameGround.appendChild(objects);
  }
}

function bugkills () {
  gameGround.addEventListener('click', (event) => {
    const target = event.target;
    if (iconButton.classList.contains('fa-stop') && target.matches('.bug')) {
      target.remove();
      playSound(audioBugKill);
      countBugKill--;
      displayCountBugKill.textContent = countBugKill;
      if (countBugKill === 0 ) {
        gameResult('win');
      };
    };
    if(iconButton.classList.contains('fa-stop') && target.matches('.carrot')) {
      gameResult('lost')
      playSound(audioCarrotSelect);
    }
  });
};

function displayGameResultBox (selects) {
  const select = selects;
  if (select === 'visible') {
    gameResultBox.classList.remove('result-box__hide');
  } else if (select === 'hidden') {
    gameResultBox.classList.add('result-box__hide');
  };
}

function displayGameResultMessage (pararesult) {
  gameResultMessage.innerHTML = `${pararesult}`;
}

function gameResult (result) {
  const results = result;
  clearInterval(timerInitialize);
  displayButtonBox('hidden');
  if (results === 'win') {
    displayGameResultMessage('You Win');
    playSound(audioYouWin);
  } else {
    displayGameResultMessage('You Lost');
    playSound(audioYouLost);
  };
  displayGameResultBox('visible');
};

function stopGame () {
  clearInterval(timerInitialize);
  displayButtonBox('hidden');
  stopSound(audioBg);
  displayGameResultMessage('Replay?');
  displayGameResultBox('visible');
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}