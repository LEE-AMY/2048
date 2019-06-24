// 2048 配置项
let conf2048 = {
        rows: 4, // 行数
        cols: 4, // 列数
        squareWidth: 100, // 每一块正方形的宽度，单位px
        spacing: 12, // 相连正方形之间的间隔，单位px
    };


let my2048,
    mask,
    boardSet  = [],  // 棋盘方块集合
    squareSet = [],  // 方块集合
    valueMap  = [],  // 棋盘值位图
    colorMapping  = {"0": "#ccc0b3", "2": "#eee4da", "4": "#ede0c8", "8": "#f2b179", "16": "#f59563", "32": "#f67e5f", "64": "#f65e3b", "128": "#edcf72", "256" : "#edcc61", "512": "#9c0", "1024": "#33b5e5", "2048": "#09c", "4096": "#5b67ff"},
    directionEnum = {
        LEFT: {x: -1, y: 0,  key: "left"}, 
        RIGHT:{x: 1,  y: 0,  key: "left"}, 
        UP:   {x: 0,  y: -1, key: "top"}, 
        DOWN: {x: 0,  y: 1,  key: "top"}
    },
    randNumArr = [2, 4], // 可产生方块内的值，2的n次幂 n>=1 n为正整数
    isChange = false,
    isLock = false,
    startX = 0,
    startY = 0;

let { rows, cols, squareWidth, spacing } = conf2048;

function isOver () {

    for (let i = 0; i < squareSet.length; i++) {
        
        for (let j = 0; j < squareSet[i].length; j++) {
            if(squareSet[i][j] == null) {
                return false;
            }

            if(squareSet[i][j + 1] && squareSet[i][j].num == squareSet[i][j + 1].num || squareSet[i + 1] && squareSet[i + 1][j] && squareSet[i][j].num == squareSet[i + 1][j].num) {
                return false;
            }
            
        }
        
    }

    return true;
}

function refresh(newSquareSet) {
    squareSet = generateNullMap();
    let newValueMap = generateNullMap();

    for(let i = 0; i < rows; i++) {

        for(let j = 0; j < cols; j++) {

            if(newSquareSet[i][j]) {
                if(newSquareSet[i][j].nextSquare) {
                    let newSquareDom = createSquare(newSquareSet[i][j].num * 2, newSquareSet[i][j].offsetLeft, newSquareSet[i][j].offsetTop, i, j);
                    squareSet[i][j] = newSquareDom;
                    my2048.appendChild(newSquareDom);
                    my2048.removeChild(newSquareSet[i][j]);
                    my2048.removeChild(newSquareSet[i][j].nextSquare);
                }else {
                    let newSquareDom = createSquare(newSquareSet[i][j].num, newSquareSet[i][j].offsetLeft, newSquareSet[i][j].offsetTop, i, j);
                    squareSet[i][j] = newSquareDom;
                    my2048.appendChild(newSquareDom);
                    my2048.removeChild(newSquareSet[i][j]);
                }

                if(valueMap[i][j] != squareSet[i][j].num) {
                    isChange = true;
                }

                newValueMap[i][j] = squareSet[i][j].num;
            }else {
                newValueMap[i][j] = 0;
            }

        }
    }
    valueMap = newValueMap;
}

function getNewLocation(arr) {
    if(arr.length == 0) {
        return [];
    }

    let temp = [];
    temp.push(arr[0]);
    for (let i = 1; i < arr.length; i++) {
        if(arr[i].num == temp[temp.length - 1].num && (!temp[temp.length - 1].nextSquare || temp[temp.length - 1].nextSquare == null)) {
            temp[temp.length - 1].nextSquare = arr[i];
        }else {
            temp.push(arr[i]);
        }
        
    }
    return temp;
}

function generateNullMap () {
    let nullMap = [];
    for(let i = 0; i < rows; i++) {
        nullMap[i] = [];
        for(let j = 0; j < cols; j++) {
            nullMap[i][j] = null;
        }
    }

    return nullMap;
}

function analysisActions(direction) {
    let newSquareSet = generateNullMap();

    if(direction == directionEnum.LEFT) {
        
        for (let i = 0; i < squareSet.length; i++) {
            let temp = []
            for (let j = 0; j < squareSet[i].length; j++) {
                if(squareSet[i][j] != null) {
                    temp.push(squareSet[i][j]);
                }
            }

            temp = getNewLocation(temp); 
            for(let k = 0; k < newSquareSet[i].length; k++) {
                if(temp[k]) {
                    newSquareSet[i][k] = temp[k];
                }
            }
        }

    } else if(direction == directionEnum.RIGHT) {
        
        for (let i = 0; i < squareSet.length; i++) {
            let temp = []
            for (let j = squareSet[i].length - 1; j >= 0; j--) {
                if(squareSet[i][j] != null) {
                    temp.push(squareSet[i][j]);
                }
            }

            temp = getNewLocation(temp); 
            for(let k = newSquareSet[i].length - 1; k >= 0; k--) {
                if(temp[newSquareSet[i].length - 1 - k]) {
                    newSquareSet[i][k] = temp[newSquareSet[i].length - 1 - k];
                }
            }
        }
    } else if(direction == directionEnum.UP) {
        for (let j = 0; j < squareSet[0].length; j++) {
            let temp = []
            for (let i = 0; i < squareSet.length; i++) {
                if(squareSet[i][j] != null) {
                    temp.push(squareSet[i][j]);
                }
            }

            temp = getNewLocation(temp); 
            for (var k = 0 ; k < newSquareSet.length ; k ++) {
                if (temp[k]) {
                    newSquareSet[k][j] = temp[k];
                }
            }
        }
    }else if(direction == directionEnum.DOWN) {
        for (let j = 0; j < squareSet[0].length; j++) {
            let temp = []
            for (let i = squareSet.length - 1 ; i >= 0 ; i --) {
                if(squareSet[i][j] != null) {
                    temp.push(squareSet[i][j]);
                }
            }

            temp = getNewLocation(temp); 
            for (var k = newSquareSet.length - 1 ; k >= 0 ; k --) {
                if (temp[newSquareSet.length - 1 - k]) {
                    newSquareSet[k][j] = temp[newSquareSet.length - 1 - k];
                }
            }
        }
    }

    // 运动+动画效果
    for(let i = 0; i < newSquareSet.length; i++) {
        for(let j = 0; j < newSquareSet[i].length; j++) {
            if (newSquareSet[i][j] == null) {
                continue;
            }

            newSquareSet[i][j].style.transition = direction.key + " 0.3s";
            newSquareSet[i][j].style.left = (j + 1) * spacing + j * squareWidth + "px";
            newSquareSet[i][j].style.top = (i + 1) * spacing + i * squareWidth + "px";

            if(newSquareSet[i][j].nextSquare) {
                newSquareSet[i][j].nextSquare.style.transition = direction.key + " 0.3s";
                newSquareSet[i][j].nextSquare.style.left = (j + 1) * spacing + j * squareWidth + "px";
                newSquareSet[i][j].nextSquare.style.top = (i + 1) * spacing + i * squareWidth + "px";
            }
        }
    }

    return newSquareSet;
}

function move (direction) {
    
    if(isOver()) {
        isLock = true;
        alert("game over~~~");
        return;
    }

    let newSquareSet = analysisActions(direction);

    setTimeout(() => {
        refresh(newSquareSet);
        if(isOver()) {
            isLock = true;
            alert("game over~~~");
        }
        if(isChange) {
            randomGenerateSquare();
        }

        isChange = false;
        isLock = false;
    }, 300);
}

function randomSquareNum () {
    return randNumArr[Math.floor( Math.random() * randNumArr.length )];
}

function randomGenerateSquare() {
    for(;;) {
        let randRow = Math.floor( Math.random() * rows );
        let randCol = Math.floor( Math.random() * cols );

        if(valueMap[randRow][randCol] == 0) {
            let temp = createSquare(randomSquareNum(), (randCol+ 1) * spacing + randCol * squareWidth, (randRow + 1) * spacing + randRow * squareWidth, randRow, randCol);
            valueMap[temp.row][temp.col] = temp.num;
            squareSet[temp.row][temp.col] = temp;
            my2048.appendChild(temp)
            return true;
        }
    }
}



function createSquare(num, left, top, row, col) {
    let oDiv = document.createElement("div");
    oDiv.style.width = squareWidth + "px";
    oDiv.style.height = squareWidth + "px";
    oDiv.style.left = left + "px";
    oDiv.style.top = top + "px";
    oDiv.style.lineHeight = squareWidth + "px";
    oDiv.style.fontSize = 0.4 * squareWidth + "px";
    oDiv.style.backgroundColor = colorMapping[num];
    oDiv.num = num;
    oDiv.row = row;
    oDiv.col = col;

    if( num > 0 ) {
        oDiv.innerHTML = "" + num;
    }

    return oDiv;
}

function initBoard() {
    my2048 = document.getElementById("my2048");
    mask = document.getElementById("mask");
    my2048.style.width = cols * squareWidth  + (cols + 1) * spacing + "px";
    my2048.style.height = rows * squareWidth  + (rows + 1) * spacing + "px";
    mask.style.width = cols * squareWidth  + (cols + 1) * spacing + "px";
    mask.style.height = rows * squareWidth  + (rows + 1) * spacing + "px";
}

function init () {
    // 初始化棋盘
    initBoard(); 

    // 初始化棋盘背景方块
    for (let i = 0; i < rows; i++) {
        boardSet[i] = [];
        squareSet[i] = [];
        valueMap[i] = [];
        for(let j = 0; j < cols; j++) {
            valueMap[i][j] = 0;
            squareSet[i][j] = null;
            boardSet[i][j] = createSquare(0, (j + 1) * spacing + j * squareWidth, (i + 1) * spacing + i * squareWidth, i, j);
            my2048.appendChild(boardSet[i][j]);
        }
        
    }

    // 初始化方块
    randomGenerateSquare();
    randomGenerateSquare();

    // 添加事件
    document.addEventListener("keydown", function (e) {
        if (isLock) {
            return;
        }
        isLock = true;
        switch(e.key) {
            case "ArrowUp":    move(directionEnum.UP); break;
            case "ArrowDown":  move(directionEnum.DOWN); break;
            case "ArrowLeft":  move(directionEnum.LEFT); break;
            case "ArrowRight": move(directionEnum.RIGHT); break;
            default: {
                isLock = false;
            }
        }
    });

    handleMouseEvent();
}

function handleMouseEvent() {
    mask.addEventListener("mousedown", function(e) {
        if(isLock) {
            return;
        }
        isLock = true;
        
        let event = e || window.event;
        startX = event.clientX;
        startY = event.clientY;
        document.addEventListener("mouseup", docMouseUp) 
    })
}

function docMouseUp(e) {
    let event = e || window.event;
    let endX = event.clientX;
    let endY = event.clientY;
    let distX = endX - startX;
    let distY = endY - startY;
    let absX = Math.abs(distX);
    let absY = Math.abs(distY);
    if(absX > 60 || absY > 60) {
        if(absX >= absY) {
            if(distX > 0) {
                move(directionEnum.RIGHT);
            }else{
                move(directionEnum.LEFT);
            }
        }else{
            if(distY > 0) {
                move(directionEnum.DOWN);
            }else{
                move(directionEnum.UP);
            }
        }
    }else{
        isLock = false;
    }
    document.removeEventListener("mouseup", docMouseUp)
}

window.onload = function () {
    init()
}