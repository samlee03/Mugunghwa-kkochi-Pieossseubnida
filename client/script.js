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
            clearInterval(timerInterval); 
        }    
    }, 1000)
}

// Red Light, Green Light Handler
let changeBackgroundTimeout; 
const changeBackground = () => {
    audio.playbackRate = 1.2;
    // console.log("Audio playback rate after reset: ", audio.playbackRate);

    audio.play();
    color = "green";
    // map.style.backgroundColor = 'var(--green)';
    bot.classList.replace('bot-left', 'bot-right');
    bot.style.backgroundImage = `url(${dollFrame[0]})`;
    const switchToRed = () => {
        if (changeBackgroundTimeout) {
            clearTimeout(changeBackgroundTimeout);
        }

        scanAudio.play();
        changeDollFrames(); // Takes 600ms
        setTimeout(() => {

            color = "red";
            // map.style.backgroundColor = 'var(--red)';
            bot.classList.replace('bot-right', 'bot-left');
            
            setTimeout(() => {
                if (!gameStart) {
                    return;
                }
                audio.playbackRate += (Math.random() * 1) - 0.25;  // Random change between -0.25 and +1.00
                audio.playbackRate = Math.max(1, Math.min(audio.playbackRate, 3.8)); // Clamp between 0.75 and 4
                // console.log(audio.playbackRate);    
                audio.play();
                // map.style.backgroundColor = 'var(--green)';
                bot.classList.replace('bot-left', 'bot-right');
                bot.style.backgroundImage = `url(${dollFrame[0]})`;
                color = "green";
                
                const audioDuration = audio.duration / audio.playbackRate;
                changeBackgroundTimeout = setTimeout(switchToRed, audioDuration * 1000); // Delay based on modified audio duration
            }, 2250);  // Wait 2.25 seconds before switching to green again
        }, 800)
    };
    // Start the first background switch
    const audioDuration = audio.duration / audio.playbackRate;
    changeBackgroundTimeout = setTimeout(switchToRed, audioDuration * 1000);
};


// Start Game
startBtn.addEventListener('click', e => {
    gameStart = true;
    startBtn.remove();
    startTimer();
    changeBackground();
});


// Repeat Game
let resetTimeout;

const retry = document.getElementById("retry");
const newGame = document.getElementById("new-game");

const resetGame = () => {
    // Reset game state
    gameStart = true;
    gameReseted = true;
    gameLost = false;
    gameWin = false;
    color = "green";  // Reset color to green

    // Reset timer display
    timer.innerText = "01:00";

    // Reset the player position
    playerBox.style.setProperty('--x', 1);
    playerBox.style.setProperty('--y', 43);

    // Reset background color and bot position
    // map.style.backgroundColor = 'var(--green)';
    bot.classList.replace('bot-left', 'bot-right');
    
    // Stop and reset audio
    audio.pause();
    audio.currentTime = 0;
    audio.playbackRate = 1.2;  // Ensure playback rate is reset to normal

    scanAudio.pause();
    scanAudio.currentTime = 0;
    scanAudio.playbackRate = 1;  // Ensure scan audio playback rate is reset

    // Clear any existing background transition timeout
    if (changeBackgroundTimeout) {
        clearTimeout(changeBackgroundTimeout);
    }

    // Restart the game timer and background change logic
    startTimer();
    changeBackground();
};
const refreshGame = () => {
    subtitle.innerText = "Retrying..";
    retry.style.visibility = "hidden";
    newGame.style.visibility = "hidden";
    
    if (resetTimeout) {
        clearTimeout(resetTimeout);
    }
    
    resetTimeout = setTimeout(() => {
        subtitle.innerText = "";
        resetGame();
    }, 1000);

}

// Retry + New Game Buttons
retry.addEventListener('click', refreshGame);
newGame.addEventListener('click', refreshGame)

const subtitle = document.getElementById("subtitle")

let keysPressed = {
    right: false,
    left: false,
    up: false,
    down: false
};

let frames = [
    './assets/images/image-1.png.png',
    './assets/images/image-2.png.png',
    './assets/images/image-3.png.png',
    './assets/images/image-4.png.png',
    './assets/images/image-5.png.png',
    './assets/images/image-6.png.png'
]

let currentFrame = 0;
let changeFrameTimeout;
let changeFrameInterval = null;

// Frame Management
function changeFrame() {
    currentFrame = (currentFrame + 1) % frames.length;
    playerBox.style.backgroundImage = `url(${frames[currentFrame]})`;
}

function startChangingFrames() {
    if (changeFrameInterval) return;
    if (!changeFrameInterval) {
        changeFrameInterval = setInterval(() => {
        changeFrame();
        }, 150); // Change frame every 100ms while the key is held
    }
}

function stopChangingFrames() {
    clearInterval(changeFrameInterval);
    changeFrameInterval = null; // Reset interval to allow new interval when key is held again
}

let isChangingFrame = false; 
const handleFrame = () => {
    if (!isChangingFrame) {
        changeFrame(); // Change the frame once
        isChangingFrame = true; // Mark that the key is being held
    }
    startChangingFrames();
}

let currDollFrame = 0;
let dollTimeouts = [];
let dollFrame = [
    './assets/images/back.png',
    './assets/images/doll/doll1.png',
    './assets/images/doll/doll2.png',
    './assets/images/doll/doll3.png',
    './assets/images/doll/doll4.png',
    './assets/images/doll/doll5.png',
    './assets/images/doll/doll6.png',
    './assets/images/front.png'
]
const changeDollFrames = () => {
    dollTimeouts.forEach(timeout => clearTimeout(timeout));

    // Clear the array of timeouts
    dollTimeouts = [];
    for (let i = 0; i < dollFrame.length; i++) {
        const timeout = setTimeout(() => {
            bot.style.backgroundImage = `url(${dollFrame[i]})`;
        }, i * 100);
        dollTimeouts.push(timeout);
    }
}

let gameReseted = true;
// Player Movement, // Checks for Win Condition
document.addEventListener("keydown", e => {
    if (!gameStart && e.key === "ArrowRight" && gameReseted) {
        startTimer();
        changeBackground();
        gameStart = true;
        gameReseted = false;
        return; 
    }
    if (!gameStart) {
        return;
    }
    if (e.key === "ArrowRight") {
        keysPressed.right = true
        handleFrame();
    };
    if (e.key === "ArrowLeft"){
        keysPressed.left = true;
        handleFrame();
    } 
    if (e.key === "ArrowUp"){
        keysPressed.up = true;
        handleFrame();
    };
    if (e.key === "ArrowDown") {
        keysPressed.down = true;
        handleFrame();
    };

    let currentX = parseFloat(getComputedStyle(playerBox).getPropertyValue('--x'));
    let currentY = parseFloat(getComputedStyle(playerBox).getPropertyValue('--y'));

    const mapWidthInVW = (map.offsetWidth / window.innerWidth) * 100; 
    const mapHeightInVH = (map.offsetHeight / window.innerHeight) * 100;
    const playerWidthInVW = 2;  
    const playerHeightInVH = 2;  

    // Move Right
    if (keysPressed.right && currentX < mapWidthInVW - playerWidthInVW) {
        if (color == "red"){
            subtitle.innerText = "You moved on a red light."
            retry.style.visibility = "visible";
            gameStart = false;
            return;
        }
        
        currentX += 0.2;
        if (currentX > 85){
            subtitle.innerText = 'You win.';
            newGame.style.visibility = "visible";

            gameStart = false;
        }
        playerBox.style.setProperty('--x', currentX);
    }

    // Move Left
    if (keysPressed.left && currentX > 0) {
        if (color == "red"){
            subtitle.innerText = "You moved on a red light."
            retry.style.visibility = "visible";
            gameStart = false;
            return;
        }
        currentX -= 0.2;
        playerBox.style.setProperty('--x', currentX);
    }

    // Move Up
    if (keysPressed.up && currentY > 0) {
        if (color == "red"){
            subtitle.innerText = "You moved on a red light."
            retry.style.visibility = "visible";
            gameStart = false;
            return;
        }
        currentY -= 0.2;
        playerBox.style.setProperty('--y', currentY);
    }

    // Move Down
    if (keysPressed.down && currentY < mapHeightInVH - playerHeightInVH) {
        if (color == "red"){
            subtitle.innerText = "You moved on a red light."
            retry.style.visibility = "visible";
            gameStart = false;
            return;
        }
        currentY += 0.2;
        playerBox.style.setProperty('--y', currentY);
    }
});

// Playing Stopped
document.addEventListener("keyup", e => {
    if (e.key === "ArrowRight") {
        keysPressed.right = false
        stopChangingFrames();
        isChangingFrame = false;
    };
    if (e.key === "ArrowLeft") {
        keysPressed.left = false
        stopChangingFrames();
        isChangingFrame = false;
    };
    if (e.key === "ArrowUp") {
        keysPressed.up = false
        stopChangingFrames();
        isChangingFrame = false;
    };
    if (e.key === "ArrowDown"){
        keysPressed.down = false
        stopChangingFrames();
        isChangingFrame = false;
    };
});