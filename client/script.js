const map = document.getElementById("map-area");
const playerBox = document.getElementById("player-box");
const bot = document.getElementById("bot");

const audio = new Audio('assets/audio/green-red.mp3');
audio.preload = 'auto';  

const scanAudio = new Audio('assets/audio/squid-scan-sound.mp3');
scanAudio.preload = 'auto';

const startBtn = document.getElementById("start-game");
let gameStart = false;
let gameLost = false;
let gameWin = false;
let color = "green"

const timer = document.getElementById("timer");
let timerInterval;
const startTimer = () => {
    let time = 60;
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    timerInterval = setInterval(() => {
        if (time > 0 && gameStart) {
            time -= 1;
            timer.innerText = `00:${time.toString().padStart(2, '0')}`;
        } else {
            gameStart = false;
            console.log("no time");
            clearInterval(timerInterval); 
        }    
    }, 1000)
}

let changeBackgroundTimeout; 
const changeBackground = () => {
    audio.playbackRate = 1.2;
    
    audio.play();
    color = "green";
    map.style.backgroundColor = 'var(--green)';
    bot.classList.replace('bot-left', 'bot-right');

    const switchToRed = () => {
        if (changeBackgroundTimeout) {
            clearTimeout(changeBackgroundTimeout);
        }
        scanAudio.play();
        color = "red";
        map.style.backgroundColor = 'var(--red)';
        bot.classList.replace('bot-right', 'bot-left');

        setTimeout(() => {
            if (!gameStart) {
                return;
            }
            audio.playbackRate = audio.playbackRate + .5;
            audio.play();
            map.style.backgroundColor = 'var(--green)';
            bot.classList.replace('bot-left', 'bot-right');

            color = "green";
            // const randomDelay = (Math.random() * 3) + 2;  // Random delay between 2-5 seconds
            const audioDuration = audio.duration / audio.playbackRate;
            changeBackgroundTimeout = setTimeout(switchToRed, audioDuration  * 1000);
        }, 2250);  // Delay before switching to green again
    };
    const audioDuration = audio.duration / audio.playbackRate;

    changeBackgroundTimeout = setTimeout(switchToRed, audioDuration * 1000);
};

startBtn.addEventListener('click', e => {
    gameStart = true;
    startBtn.remove();
    startTimer();
    changeBackground();
});

const retry = document.getElementById("retry");
retry.addEventListener('click', () => {
    console.log("retried");
    subtitle.innerText = "";
    gameStart = true;
    retry.style.visibility = "hidden";
    timer.innerText = "01:00";
    
    playerBox.style.setProperty('--x', 1);
    playerBox.style.setProperty('--y', 43);

    if (changeBackgroundTimeout) {
        clearTimeout(changeBackgroundTimeout);
    }

    startTimer();
    changeBackground();
});

const subtitle = document.getElementById("subtitle")
document.addEventListener("keydown", e => {
    if (!gameStart) {
        return; 
    }

    let currentX = parseFloat(getComputedStyle(playerBox).getPropertyValue('--x'));
    let currentY = parseFloat(getComputedStyle(playerBox).getPropertyValue('--y'));

    const mapWidthInVW = (map.offsetWidth / window.innerWidth) * 100; 
    const mapHeightInVH = (map.offsetHeight / window.innerHeight) * 100;
    const playerWidthInVW = 2;  
    const playerHeightInVH = 2;  

    // Move Right
    if (e.key === "ArrowRight" && currentX < mapWidthInVW - playerWidthInVW) {
        if (color == "red"){
            console.log("YOU'RE OUTTTT");
            subtitle.innerText = "You moved on a red light."
            retry.style.visibility = "visible";
            gameStart = false;
            return;
        }
        
        currentX += 0.2;
        if (currentX > 85){
            console.log("You win!");
            subtitle.innerText = 'You win.';
            gameStart = false;
        }
        playerBox.style.setProperty('--x', currentX);
    }

    // Move Left
    if (e.key === "ArrowLeft" && currentX > 0) {
        if (color == "red"){
            console.log("YOU'RE OUTTTT");
            subtitle.innerText = "You moved on a red light."
            retry.style.visibility = "visible";
            gameStart = false;
            return;
        }
        currentX -= 0.2;
        playerBox.style.setProperty('--x', currentX);
    }

    // Move Up
    if (e.key === "ArrowUp" && currentY > 0) {
        if (color == "red"){
            console.log("YOU'RE OUTTTT");
            subtitle.innerText = "You moved on a red light."
            retry.style.visibility = "visible";
            gameStart = false;
            return;
        }
        currentY -= 0.2;
        playerBox.style.setProperty('--y', currentY);
    }

    // Move Down
    if (e.key === "ArrowDown" && currentY < mapHeightInVH - playerHeightInVH) {
        if (color == "red"){
            console.log("YOU'RE OUTTTT");
            subtitle.innerText = "You moved on a red light."
            retry.style.visibility = "visible";
            gameStart = false;
            return;
        }
        currentY += 0.2;
        playerBox.style.setProperty('--y', currentY);
    }
});
