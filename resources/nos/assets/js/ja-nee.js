$(document).ready(function(){

	var state = "voorkant";
	resize();

	$("#ja").on("click", function(){
		flip();
	});

	$("#nee").on("click", function() {
		flip();
	})

	function flip() {
		ja();
		nee();
		$("#ja-nee-container").css({
			//"display": "none"
		})
		$("#ja-nee-result").css({
			"transform": "rotateY(0deg)",
			"display": "block"
		});
	}

	function ja() {
		$("#ja").css({
			"transform": "rotateY(180deg)"
		});
	}

	function nee() {
		$("#nee").css({
			"transform": "rotateY(180deg)"
		});
	}

	$(window).resize(function() {	
		resize();
	});

	function resize() {
		$("#ja-nee-container").css("left", 	( ($(window).width() -  $("#ja-nee-container").width()) / 2));
	}

});