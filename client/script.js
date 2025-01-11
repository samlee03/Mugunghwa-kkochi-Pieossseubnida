console.log("Script is running");
const map = document.getElementById("map-area");
const playerBox = document.getElementById("player-box");
document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight" && parseFloat(getComputedStyle(playerBox).getPropertyValue('--x')) < map.offsetWidth) {  // Correct key check
        let currentX = parseFloat(getComputedStyle(playerBox).getPropertyValue('--x'));
        currentX += 0.2;  // Increment position (adjust the value to control speed)
        playerBox.style.setProperty('--x', currentX);
    }
    if (e.key === "ArrowLeft" && parseFloat(getComputedStyle(playerBox).getPropertyValue('--x')) < map.offsetWidth) {  // Correct key check
        let currentX = parseFloat(getComputedStyle(playerBox).getPropertyValue('--x'));
        currentX -= 0.2;  // Increment position (adjust the value to control speed)
        playerBox.style.setProperty('--x', currentX);
    }
    if (e.key === "ArrowUp") {  // Correct key check
        let currentY = parseFloat(getComputedStyle(playerBox).getPropertyValue('--y'));
        currentY -= 0.2;  // Increment position (adjust the value to control speed)
        playerBox.style.setProperty('--y', currentY);
    }
    if (e.key === "ArrowDown") {  // Correct key check
        let currentY = parseFloat(getComputedStyle(playerBox).getPropertyValue('--y'));
        currentY += 0.2;  // Increment position (adjust the value to control speed)
        playerBox.style.setProperty('--y', currentY);
    }
});