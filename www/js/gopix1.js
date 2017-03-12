// JavaScript Document
$(function(){
	var toplay = 'black';

	// setup the board
	for (var count=1; count<1089; count++){
		$('#gopix').append("<a href='#' class='pix'></a>");
	}

	// calculate backgrounPosition
	function turn(){
		if (toplay == 'black') {
			toplay = 'white';
			return 'black';
		} else {
			toplay = 'black';
			return 'white';
		}
	}
		
	// change color on click to black or white
	$('a.pix').click(function(){
		if (($(this).hasClass('white')===false) && ($(this).hasClass('black')===false)) {
			$(this).addClass(turn());
		}
	});
});