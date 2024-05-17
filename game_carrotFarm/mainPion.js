const timerbox = document.querySelector('.timerbox');
const timer = document.querySelector('.timer');
const buttonBox = document.querySelector('.button__box');
const button = document.querySelector('.button');
const gameground = document.querySelector('.gameground');
const displayCountBugKill = document.querySelector('.displaycount__bugkill')
const audioBg = document.querySelector('#audioBg');
const audioBugKill = document.querySelector('#audioBugKill');
const audioCarrotSelect = document.querySelector('#audioCarrotSelect');
const audioYouWin = document.querySelector('#audioYouWin');
const audioYouLost = document.querySelector('#audioYouLost');

let countTime;
let countBugKill = 10;
let timeValue = 10;
objectsGenerator('carrot');
objectsGenerator('bug');

// Button 클릭
button.addEventListener('click', () => {
  if (timeValue === 10) {
    startTimer();
    bugkills();
    stopButton();
  };
  if (timeValue === 0 || countBugKill === 0) {
    replay();
  };
  // if (timeValue < 10 && timeValue !== 0 ) {
  //   clearInterval(countTime)
  // };
  audioBg.play();
})

// Button  종류
function stopButton () {
  button.classList.remove('fa-solid');
  button.innerHTML = '<i class="fa-solid fa-stop"></i>';
}
function replayButton () {
  button.classList.remove('fa-solid');
  button.innerHTML = '<i class="fa-solid fa-rotate-right"></i>';
}

function replay () {
  let removeResultBox = document.querySelector('.result__box');
  removeResultBox.remove();
  let carrots = document.querySelectorAll('.carrot');
  carrots.forEach(carrot => {
    carrot.remove();
  });
  let bugs = document.querySelectorAll('.bug');
  bugs.forEach(bug => {
    bug.remove();
  });
  countBugKill = 10;
  displayCountBugKill.textContent = countBugKill;
  timeValue = 10;
  timer.textContent = '00:10';
  objectsGenerator('carrot');
  objectsGenerator('bug');
  startTimer();
  stopButton();
  buttonBox.appendChild(button);
}

function timerSetting () {
  let minutes = Math.floor(timeValue / 60);
  let seconds = timeValue % 60;   // 몫 > 0, 나머지 > 30
  timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer () {
  countTime = setInterval(function() {
    timeValue--;
    timerSetting();

    if (timeValue === 0) {
      clearInterval(countTime);
      result()
    };
  }, 1000);
}

function objectsGenerator(input) {
  for (let i = 0; i < 10; i++) {
    let objects = input;
    objects = document.createElement('img');
    objects.setAttribute('class', `${input}`);
    objects.src = `/game_carrotFarm/img/${input}.png`;
    objects.alt = `${input}${i}`;
    objects.setAttribute('data-id', `${input}-${i}`);
    let minX = 0;
    let maxX = gameground.clientWidth - (objects.width + 1);
    let minY = 0;
    let maxY = gameground.clientHeight - (objects.height + 1);
    let randomX = Math.floor(Math.random()*(maxX - minX + 1)) + minX;
    let randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
    objects.style.position = 'absolute';
    objects.style.left = randomX + 'px';
    objects.style.top = randomY + 'px';
    gameground.appendChild(objects);
  }
}

function bugkills () {
  gameground.addEventListener('click', (event) => {
    if (timeValue !== 0 && event.target.classList.contains('bug')) {
      event.target.remove();
      audioBugKill.play();
      countBugKill--;
      displayCountBugKill.textContent = countBugKill;
      if (countBugKill === 0 ) {
        result(countBugKill);
      };
    };
    if(timeValue !== 0 && event.target.classList.contains('carrot')) {
      audioCarrotSelect.play()
    }
  });
};

function generatorResultBox (paraResult) {
  const resultBox = document.createElement('div');
  resultBox.setAttribute('class', 'result__box');
  const resultText = document.createElement('p');
  resultText.setAttribute('class', 'result__text');
  resultText.textContent = paraResult;
  gameground.appendChild(resultBox);
  replayButton();
  resultBox.appendChild(button);
  resultBox.appendChild(resultText);
}

function result (countBugKill) {
  if (countBugKill === 0) {
    clearInterval(countTime);
    generatorResultBox('You Win');
    audioYouWin.play();
  } else {
    clearInterval(countTime);
    generatorResultBox('You Lost');
    audioYouLost.play();
  };
};