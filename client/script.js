console.log("Script is running");
const map = document.getElementById("map-area");
const playerBox = document.getElementById("player-box");

const startBtn = document.getElementById("start-game");
let gameStart = false;
let color = "green"
const changeBackground = () => {
    map.style.backgroundColor = 'var(--green)';
    
    const switchToRed = () => {
        color = "red";
        map.style.backgroundColor = 'var(--red)';
        setTimeout(() => {
            if(!gameStart){
                return;
            }
            map.style.backgroundColor = 'var(--green)';
            color = "green";
            const randomDelay = (Math.random() * 3) + 2; 
            setTimeout(switchToRed, randomDelay * 1000); 
        }, 2000); 
    };
    
    switchToRed();
};
startBtn.addEventListener('click', e => {
    gameStart = true;
    startBtn.remove();
    changeBackground();
})

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
            gameStart = false;
            return;
        }
        currentX += 0.2;
        playerBox.style.setProperty('--x', currentX);
    }

    // Move Left
    if (e.key === "ArrowLeft" && currentX > 0) {
        currentX -= 0.2;
        playerBox.style.setProperty('--x', currentX);
    }

    // Move Up
    if (e.key === "ArrowUp" && currentY > 0) {
        currentY -= 0.2;
        playerBox.style.setProperty('--y', currentY);
    }

    // Move Down
    if (e.key === "ArrowDown" && currentY < mapHeightInVH - playerHeightInVH) {
        currentY += 0.2;
        playerBox.style.setProperty('--y', currentY);
    }
});
