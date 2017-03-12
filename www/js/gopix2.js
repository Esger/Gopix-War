// JavaScript Document
$(function(){
	var toplay = 'black';
	var board = [];

	// setup the board
	for (var count=1; count<1089; count++){
		$('#gopix').append("<a href='#' class='pix' id="+count+"></a>");
		board[count]='empty';
	}

	// switch color
	function turn(){
		if (toplay == 'black') {
			toplay = 'white';
		} else {
			toplay = 'black';
		}
	}
		
	// register clicked pieces and change to black or white
	$('a.pix').click(function(){
		if (($(this).hasClass('white')===false) && ($(this).hasClass('black')===false)) {
			$(this).addClass(toplay);
			board[count]=toplay;
			turn();
		}
	});
});