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

function noQi(chessBoard, row, column, color) {
	var neighbor = getNeighbor(row, column);
	var noQi = true;
	for(var i = 0; i < neighbor.length; i++){
		var currentNeighbor = neighbor[i];
		if (chessBoard[currentNeighbor[0]][currentNeighbor[1]] == 0) {
			return false;
		}
		if(chessBoard[currentNeighbor[0]][currentNeighbor[1]] == color%2 + 1) {
			noQi = noQi & true;
		}
		else {
//			var sameNeighbor = getNeighbor(currentNeighbor[0], currentNeighbor[1]);
			noQi = noQi & false;
		}
	}
	return noQi;
}

function isValid(chessBoard, row, column, color) {
	if (chessBoard[row][column] > 0) {
		return false;
	}
	var neighbor = getNeighbor(row, column);
	var oppositeNeighbor = true;
	for(var i = 0; i < neighbor.length; i++){
		var currentNeighbor = neighbor[i];
		if(chessBoard[currentNeighbor[0]][currentNeighbor[1]] == color%2 + 1) {
			oppositeNeighbor = oppositeNeighbor & true;
		}
		else {
			oppositeNeighbor = oppositeNeighbor & false;
		}
	}
	if (oppositeNeighbor) {
		return false;
	}
	return true;
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

function play(chessBoard, row, column, color) {
	if (isValid(chessBoard, row, column, color)) {
		chessBoard[row][column] = color;
		return true;
	}
	return false;
}

var c=document.getElementById("goBoard");
var ctx=c.getContext("2d");
drawBoard(ctx);
var chessBoard = create2DArray(19,19);
initBoard(chessBoard);
var currentColor = 1;
