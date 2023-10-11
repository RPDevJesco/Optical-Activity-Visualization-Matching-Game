const canvas = document.getElementById('canvas');
const targetCanvas = document.getElementById('targetCanvas');
const ctx = canvas.getContext('2d');
const targetCtx = targetCanvas.getContext('2d');
const someToleranceValue = 10000;
let sugarConcentration = 0;

function generateRandomPattern(targetCtx) {
    // Create a random radial gradient for the target pattern
    const targetGradient = targetCtx.createRadialGradient(
        targetCanvas.width / 2, targetCanvas.height / 2, 10,
        targetCanvas.width / 2, targetCanvas.height / 2, targetCanvas.width / 2
    );

    targetGradient.addColorStop(0, 'black');
    targetGradient.addColorStop(0.5, 'blue');
    targetGradient.addColorStop(1, 'white');
    targetCtx.fillStyle = targetGradient;
    targetCtx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
    
    const imageData = targetCtx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);
    const data = imageData.data;
    // Generating a random sugar concentration between 0 and 1 in increments of 0.1
    const randomSugarConcentration = Math.round(Math.random() * 10) / 10;

    for (let i = 0; i < data.length; i += 4) {
        const rotation = randomSugarConcentration * (data[i] / 255);
        const color = mapRotationToColor(rotation);
        const rgb = color.match(/\d+/g);
        data[i] = parseInt(rgb[2]);
        data[i + 1] = parseInt(rgb[1]);
        data[i + 2] = parseInt(rgb[0]);
    }

    targetCtx.putImageData(imageData, 0, 0);
}

function mapRotationToColor(rotation) {
    // Map the rotation angle to a color 
    const blue = 255 * rotation;
    const green = 255 * (1 - rotation);
    return `rgb(0, ${green}, ${blue})`;
}

function shineLight() {
    // Defining gradient for user canvas
    const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 10,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    gradient.addColorStop(0, 'black');
    gradient.addColorStop(0.5, 'blue');
    gradient.addColorStop(1, 'white');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        // Consider both the pixel intensity and the sugar concentration
        const rotation = sugarConcentration * (data[i] / 255);
        const color = mapRotationToColor(rotation);
        const rgb = color.match(/\d+/g);
        data[i] = parseInt(rgb[2]);
        data[i + 1] = parseInt(rgb[1]);
        data[i + 2] = parseInt(rgb[0]);
    }
    ctx.putImageData(imageData, 0, 0);
}

function addSugar() {
    sugarConcentration = sugarConcentration + 0.1
    shineLight();
}

function reset() {
    sugarConcentration = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function checkSolution() {
    // Compare the user's canvas to the target canvas
    const targetData = targetCtx.getImageData(0, 0, targetCanvas.width, targetCanvas.height).data;
    const userData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let difference = 0;
    for (let i = 0; i < targetData.length; i++) {
        difference += Math.abs(targetData[i] - userData[i]);
    }

    if (difference < someToleranceValue) {
        alert("You've matched the pattern!");
        reset();
        newGame();
    } else {
        alert("Keep trying!");
    }
}

function newGame() {
    // Call the function to generate the pattern on the target canvas
    generateRandomPattern(targetCtx);
}

document.addEventListener('DOMContentLoaded', function() {
    const targetCanvas = document.getElementById('targetCanvas');
    const targetCtx = targetCanvas.getContext('2d');
    generateRandomPattern(targetCtx);
});
