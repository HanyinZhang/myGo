function drawBlack(ctx, x, y) {
	ctx.beginPath();
	ctx.arc(x, y, 16, 0, 2 * Math.PI, true);
	ctx.fillStyle = "black";
	ctx.fill();
}

function drawWhite(ctx, x, y) {
	ctx.beginPath();
	ctx.arc(x, y, 16, 0, 2 * Math.PI, true);
	ctx.fillStyle = "white";
	ctx.fill();
}

function removeStone(ctx, x, y) {
	ctx.clearRect(x-20, y-20, 40, 40);
}

function getNeighbor(row, column) {
	var result = [];
	if (row - 1 >= 0) {
		result.push([row-1, column]);
	}
	if (row + 1 <= 18) {
		result.push([row+1, column]);
	}
	if (column - 1 >= 0) {
		result.push([row, column-1]);
	}
	if (column + 1 <= 18) {
		result.push([row, column+1]);
	}
	return result;
}

function hasQi(chessBoard, row, column) {
	var neighbor = getNeighbor(row, column);
	for(var i = 0; i < neighbor.length; i++){
		var currentNeighbor = neighbor[i];
		if (chessBoard[currentNeighbor[0]][currentNeighbor[1]] == 0) {
			return true;
		}
	}
	return false;
}

function isKo(){
    
}

function getSameNeibghors(chessBoard, row, column, color, result) {
	var neighbors = getNeighbor(row, column);
	for(var i = 0; i < neighbors.length; i++){
		var currentNeighbor = neighbors[i];
		var currentRow = currentNeighbor[0];
		var currentColumn = currentNeighbor[1]
		if (chessBoard[currentRow][currentColumn] == color) {
			var currentKey = currentRow + "," + currentColumn;
			if(!(currentKey in result)) {
				result[currentKey] = [currentRow,currentColumn];
				getSameNeibghors(chessBoard, currentRow, currentColumn, color, result);
			}
		}
	}
}

function isValid(chessBoard, row, column, color, ctx, xOffset, yOffset) {
	if (chessBoard[row][column] > 0) {
		return false;
	}
    if (koQueue.length > 0) {
        if (koQueue[0][0] == row && koQueue[0][1] == column) {
            return false;
        }
        else {
            koQueue.shift();
        }
    }
	var neighbor = getNeighbor(row, column);
	var oppositeNeighbor = true;
    var takenStones = [];
	for(var i = 0; i < neighbor.length; i++){
		var currentNeighbor = neighbor[i];
		if(chessBoard[currentNeighbor[0]][currentNeighbor[1]] == color%2 + 1) {
			chessBoard[row][column] = color;
			var deadStones = findDead(chessBoard, currentNeighbor[0], currentNeighbor[1], color%2 + 1);
			chessBoard[row][column] = 0;
			if (deadStones.length > 0) {
				oppositeNeighbor = oppositeNeighbor & false;
				for (var j = 0; j < deadStones.length; j++) {
					take(chessBoard, deadStones[j][0], deadStones[j][1], ctx, xOffset, yOffset);
				}
                Array.prototype.push.apply(takenStones,deadStones);
			}
			else {
				oppositeNeighbor = oppositeNeighbor & true;
			}
		}
		else {
			chessBoard[row][column] = color;
			var deadSameStones = findDead(chessBoard, row, column, color);
			chessBoard[row][column] = 0;
			if (deadSameStones.length > 0){
				oppositeNeighbor = oppositeNeighbor & true;
			}
            else {
                oppositeNeighbor = oppositeNeighbor & false;
            }
		}
	}
    if (takenStones.length == 1) {
        chessBoard[takenStones[0][0]][takenStones[0][1]] = color%2 + 1;
        var isKo = true;
        for(var j = 0; j < neighbor.length; j++){
            if(chessBoard[neighbor[j][0]][neighbor[j][1]] == color%2 + 1) {
                isKo = isKo & true;
            }
            else  {
                isKo = isKo & false;
            }
        }
        if(isKo) {
            koQueue.push(takenStones[0]);
        }
        chessBoard[takenStones[0][0]][takenStones[0][1]] = 0;
    }
	if (oppositeNeighbor) {
		return false;
	}
	return true;
}

function findDead(chessBoard, row, column, color) {
	var sameNeighbors = {};
	getSameNeibghors(chessBoard, row, column, color, sameNeighbors);
	var keys = Object.keys(sameNeighbors);
	var result = [];
	if (hasQi(chessBoard, row, column)){
		return [];
	}
	else {
		result.push([row, column]);
	}
	for(var i = 0; i < keys.length; i++){
		var currentVal = sameNeighbors[keys[i]];
		if (hasQi(chessBoard, currentVal[0], currentVal[1])) {
			return [];
		}
		result.push([currentVal[0], currentVal[1]]);
	}
	return result;
}

function drawDot(ctx,x,y) {
    ctx.beginPath();
	ctx.arc(x, y, 2, 0, 2 * Math.PI, true);
	ctx.fill();
}

function drawBoard(ctx) {
    for(i=0;i<19;i++){
        for(j=0;j<19;j++){
            ctx.moveTo(40,40*j+40);
            ctx.lineTo(760,40*j+40);
            ctx.stroke();
            ctx.moveTo(40*i+40,40);
            ctx.lineTo(40*i+40,760);
            ctx.stroke();
            if(i==3 || i==9 || i==15){
                if (j==3 || j==9 || j==15) {
                    drawDot(ctx, 40*i+40,40*j+40);
                }
            }
        }
    }
}
function create2DArray(row, column) {
	var result = new Array(row);
	for (var i = 0; i < row; i++) {
		result[i] = new Array(column);
	}
	return result;
}

function initBoard(chessBoard) {
	for (var i = 0; i < chessBoard.length; i ++) {
		var currentRow = chessBoard[i];
		for(var j = 0; j < currentRow.length; j++) {
			currentRow[j] = 0;
		}
	}
}

function take(chessBoard, row, column, ctx, xOffset, yOffset) {
	chessBoard[row][column] = 0;
	removeStone(ctx, row*40 + xOffset, column*40 + yOffset);
}

function play(chessBoard, row, column, color, ctx, xOffset, yOffset) {
	if (isValid(chessBoard, row, column, color, ctx, xOffset, yOffset)) {
		chessBoard[row][column] = color;
		return true;
	}
	return false;
}

var c=document.getElementById("goBoard");
var ctx=c.getContext("2d");
drawBoard(ctx);
var chessBoard = create2DArray(19,19);
var koQueue = [];
initBoard(chessBoard);
var currentColor = 1;
