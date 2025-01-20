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
    audio.playbackRate = 1.2;  // Set the desired playback speed (can adjust as needed)
    console.log("Audio playback rate after reset: ", audio.playbackRate);

    // Start the audio
    audio.play();
    color = "green";
    // map.style.backgroundColor = 'var(--green)';
    bot.classList.replace('bot-left', 'bot-right');

    // Function to switch to red background after some time
    const switchToRed = () => {
        if (changeBackgroundTimeout) {
            clearTimeout(changeBackgroundTimeout);
        }
        scanAudio.play();
        color = "red";
        // map.style.backgroundColor = 'var(--red)';
        bot.classList.replace('bot-right', 'bot-left');

        // Switch back to green after the delay (based on audio duration and playback rate)
        setTimeout(() => {
            if (!gameStart) {
                return;
            }
            audio.playbackRate += (Math.random() * 1) - 0.25;  // Random change between -0.25 and +1.00
            audio.playbackRate = Math.max(1, Math.min(audio.playbackRate, 3.8)); // Clamp between 0.75 and 4
            console.log(audio.playbackRate);    
            audio.play();
            // map.style.backgroundColor = 'var(--green)';
            bot.classList.replace('bot-left', 'bot-right');

            color = "green";

            // Calculate the duration based on playback rate to sync background change with audio
            const audioDuration = audio.duration / audio.playbackRate;
            changeBackgroundTimeout = setTimeout(switchToRed, audioDuration * 1000); // Delay based on modified audio duration
        }, 2250);  // Wait 2.25 seconds before switching to green again
    };

    // Start the first background switch
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
const resetGame = () => {
    // Reset game state
    gameStart = true;
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

let resetTimeout;
// Retry button listener

const refreshGame = () => {
    console.log("retried");

    subtitle.innerText = "Retrying..";
    retry.style.visibility = "hidden";
    
    if (resetTimeout) {
        clearTimeout(resetTimeout);
    }
    
    resetTimeout = setTimeout(() => {
        subtitle.innerText = "";
        resetGame();
    }, 1000);

}
retry.addEventListener('click', () => {
    console.log("retried");

    // Reset subtitle and retry button visibility
    subtitle.innerText = "Retrying..";
    retry.style.visibility = "hidden";
    
    // Call resetGame to reset all properties and start fresh
    if (resetTimeout) {
        clearTimeout(resetTimeout);
    }
    // resetGame();
    
    resetTimeout = setTimeout(() => {
        subtitle.innerText = "";
        resetGame();
    }, 1000);

});

const newGame = document.getElementById("new-game");
newGame.addEventListener('click', refreshGame)

const subtitle = document.getElementById("subtitle")

let keysPressed = {
    right: false,
    left: false,
    up: false,
    down: false
};
document.addEventListener("keydown", e => {
    if (!gameStart) {
        return; 
    }
    if (e.key === "ArrowRight") keysPressed.right = true;
    if (e.key === "ArrowLeft") keysPressed.left = true;
    if (e.key === "ArrowUp") keysPressed.up = true;
    if (e.key === "ArrowDown") keysPressed.down = true;

    let currentX = parseFloat(getComputedStyle(playerBox).getPropertyValue('--x'));
    let currentY = parseFloat(getComputedStyle(playerBox).getPropertyValue('--y'));

    const mapWidthInVW = (map.offsetWidth / window.innerWidth) * 100; 
    const mapHeightInVH = (map.offsetHeight / window.innerHeight) * 100;
    const playerWidthInVW = 2;  
    const playerHeightInVH = 2;  

    // Move Right
    if (keysPressed.right && currentX < mapWidthInVW - playerWidthInVW) {
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
            // newGame.style.visibility = "visible";

            gameStart = false;
        }
        playerBox.style.setProperty('--x', currentX);
    }

    // Move Left
    if (keysPressed.left && currentX > 0) {
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
    if (keysPressed.up && currentY > 0) {
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
    if (keysPressed.down && currentY < mapHeightInVH - playerHeightInVH) {
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
document.addEventListener("keyup", e => {
    if (e.key === "ArrowRight") keysPressed.right = false;
    if (e.key === "ArrowLeft") keysPressed.left = false;
    if (e.key === "ArrowUp") keysPressed.up = false;
    if (e.key === "ArrowDown") keysPressed.down = false;
});