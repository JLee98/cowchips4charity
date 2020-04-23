var gameId = "";
var boardArray;
$(document).ready(function()
{         // /config/localStorageNames.gameId'?
		$.get("http://localhost:27017/admin/games/", function(gameId)
		{

			var currentGameId = gameId[0].count;
			gameId += currentGameId;
			alert("gameId: " + gameId);
		});
		//"ObjectId(5cad0d1224e4fb95d455865b)"
		$.get("http://localhost:27017/admin/games/" + gameId, function(board)
		{
				boardArray = board;
		});
});
var usedNums = new Array(35);

function newCard() {
	//Starting loop through each square card
	for(var i=0; i < 36; i++)
	{  //<--always this code for loops. change in red
		//setSquare(i);
	}
}

function setSquare(thisSquare) {
	var currSquare = "square"+thisSquare;
	var newNum;

	var colPlace =new Array(0,1,2,3,4,5,0,1,2,3,4,5,0,1,2,3,4,5,0,1,2,3,4,5,0,1,2,3,4,5,0,1,2,3,4,5);

	do
	{
		newNum = getNewNum();
		//(colPlace[thisSquare] * 15) + getNewNum() + 1;
	}
	while (usedNums[newNum]);

	usedNums[newNum] = true;
	//The non hard-coded version
	/*
			for(var i = 0; i < board.length; i++)
			{
				document.getElementById(currSquare).innerHTML = board[i];
		  }
	*/
	document.getElementById(currSquare).innerHTML = newNum;
}

function getNewNum() {
	return Math.floor(Math.random() * 36);

}

function anotherCard() {
	for(var i=1; i<usedNums.length; i++) {
	usedNums[i] = false;
	}

	newCard();
}
