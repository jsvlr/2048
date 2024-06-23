let board;
let score = 0;
let rows = 4;
let columns = 4;
// This variables used to track if the player win
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

let startX = 0;
let startY = 0;

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("div");
      tile.id = `${r}-${c}`;
      let num = board[r][c];
      updateTile(tile, num);
      document.getElementById("board").append(tile);
    }
  }
  setTwo();
  setTwo();
}

function updateTile(tile, num) {
  tile.innerText = "";
  tile.classList.value = "";
  tile.classList.add("tile");
  if (num > 0) {
    tile.innerText = `${num}`;
    if (num <= 4096) {
      tile.classList.add(`x${num}`);
    } else {
      tile.classList.add("x8192");
    }
  }
}

function handleSlide(e) {
  arrowDirections = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
  if (arrowDirections.includes(e.code)) {
    if (e.code == "ArrowLeft") {
      slideLeft();
    } else if (e.code == "ArrowRight") {
      slideRight();
    } else if (e.code == "ArrowUp") {
      slideUp();
    } else if (e.code == "ArrowDown") {
      slideDown();
    }
    document.getElementById("score").innerText = score;
    setTwo();
    setTimeout(() => {
      checkWin();
    }, 1000);

    checkWin();
    if (hasLost() == true) {
      setTimeout(() => {
        alert("Game Over! ");
        restartGame();
        alert("Click any arrow key to restart");
      }, 100);
    }
  }
}

// This functions removes the zeroes from the row / col
function filterZero(row) {
  return row.filter((num) => num != 0);
}

// slide function is the one merging the adjacent tiles
function slide(row) {
  row = filterZero(row);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] == row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }
  while (row.length < columns) {
    row.push(0);
  }
  return row;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    // Line for animation
    // This document the original position of the tiles.
    let originalRow = row.slice();
    row = slide(row);
    board[r] = row;
    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(`${r}-${c}`);
      let num = board[r][c];
      // line for animation
      if (originalRow[c] !== num && num !== 0) {
        // If the original tile is not equal to current tile then apply animation
        tile.style.animation = "slide-from-right 0.3s";
        setTimeout(() => {
          // Remove animation class for tile after slide
          tile.style.animation = "";
        }, 300);
      }
      updateTile(tile, num);
    }
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    // Line for animation
    let originalRow = row.slice();
    row.reverse();
    row = slide(row);
    row.reverse();
    board[r] = row;
    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(`${r}-${c}`);
      let num = board[r][c];
      if (originalRow[c] !== num && num !== 0) {
        tile.style.animation = "slide-from-left 0.3s";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300);
      }
      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
    let originalColumn = col.slice();
    col = slide(col);

    // This will record the current position of tiles that is changed
    let changedIndeces = [];
    for (let r = 0; r < rows; r++) {
      if (originalColumn[r] !== col[r]) {
        changedIndeces.push(r);
      }
    }
    console.log(changedIndeces);
    for (let r = 0; r < rows; r++) {
      board[r][c] = col[r];
      let tile = document.getElementById(`${r}-${c}`);
      let num = board[r][c];

      if (changedIndeces.includes(r) && num !== 0) {
        tile.style.animation = "slide-from-bottom 0.3s";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300);
      }
      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
    let originalColumn = col.slice();
    col.reverse();
    col = slide(col);
    col.reverse();
    // This will record the current position of tiles that is changed
    let changedIndeces = [];
    for (let r = 0; r < rows; r++) {
      if (originalColumn[r] !== col[r]) {
        changedIndeces.push(r);
      }
    }

    for (let r = 0; r < rows; r++) {
      board[r][c] = col[r];
      let tile = document.getElementById(`${r}-${c}`);
      let num = board[r][c];
      if (changedIndeces.includes(r) && num !== 0) {
        tile.style.animation = "slide-from-top 0.3s";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300);
      }
      updateTile(tile, num);
    }
  }
}

function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] == 0) {
        return true;
      }
    }
  }
  return false;
}

function setTwo() {
  if (hasEmptyTile() == false) {
    return;
  }
  let found = false;
  while (!found) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);
    if (board[r][c] == 0) {
      board[r][c] = 2;
      let tile = document.getElementById(`${r}-${c}`);
      tile.innerText = "2";
      tile.classList.add("x2");
      found = true;
    }
  }
}

function checkWin() {
  for (let r = 0; r < rows; r++) {
    if (board[r].includes(2048) && !is2048Exist) {
      alert("You Win! You got the 2048");
      is2048Exist = true;
    } else if (board[r].includes(4096) && !is4096Exist) {
      alert("You Win! You got the 4096");
      is4096Exist = true;
    } else if (board[r].includes(8192) && !is8192Exist) {
      alert("You Win! You got the 8192");
      is8192Exist = true;
    }
  }
}

function hasLost() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return false;
      }
      const currentTile = board[r][c];
      if (
        (r > 0 && board[r - 1][c] === currentTile) ||
        (r < rows - 1 && board[r + 1][c] === currentTile) ||
        (c > 0 && board[r][c - 1] === currentTile) ||
        (c < columns - 1 && board[r][c + 1] === currentTile)
      ) {
        return false;
      }
    }
  }
  return true;
}

function restartGame() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      board[r][c] = 0;
    }
  }
  score = 0;
  setTwo();
}

document.addEventListener("keydown", handleSlide);

window.onload = function () {
  setGame();
};

// This code will listen when we touch the screen and assigns the y coordinates of that
// touch event
// Inputs the x coordinate value to start
document.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

document.addEventListener(
  "touchmove",
  (e) => {
    if (!e.target.className.includes("tile")) {
      return;
    }
    // To disable scrolling feature.
    e.preventDefault();
  },
  { passive: false } // Use passive property to make sure that the preventDefault will work.
);

document.addEventListener("touchend", (e) => {
  if (!e.target.className.includes("tile")) {
    return;
  }
  let diffX = startX - e.changedTouches[0].clientX;
  let diffY = startY - e.changedTouches[0].clientY;
  let swipeDirection;
  if (Math.abs(diffX) > Math.abs(diffY)) {
    swipeDirection = diffX > 0 ? "left" : "right";
  } else {
    swipeDirection = diffY > 0 ? "up" : "down";
  }

  if (swipeDirection == "left") {
    slideLeft();
  } else if (swipeDirection == "right") {
    slideRight();
  } else if (swipeDirection == "up") {
    slideUp();
  } else if (swipeDirection == "down") {
    slideDown();
  }
  setTwo();
  setTimeout(() => {
    checkWin();
  }, 1000);

  checkWin();
  if (hasLost() == true) {
    setTimeout(() => {
      alert("Game Over! ");
      restartGame();
      alert("Click any arrow key to restart");
    }, 100);
  }
});
