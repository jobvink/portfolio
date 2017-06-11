$(document).ready(function(){

	$(window).scroll(function(){
		
		var scroll = $(window).scrollTop();
		var pyongpyang = $("#pyongyang").position().top;
		var wonsan = $("#wonsan").position().top;

		//var pyongyangImg = $("#pyongyang img").position().top;
		//var wonsanImg = $("#wonsan img").position().top;

		var pyongpyangScroll = ((scroll - pyongpyang) * 0.1);
		var wonsanScroll = ((scroll - wonsan) * 0.1);


		//if ( (pyongyangImg - 20) > pyongyang) {
			$(".pyongyang-parallax-job").css("transform", "translateY(" + pyongpyangScroll + "px)");
		//}

		//if ( (wonsanImg - 20) > wonsan) {
			$(".wonsan-parallax-job").css("transform", "translateY(" + wonsanScroll + "px)");
		//}

		//console.log((scroll - pyongpyang) * 0.15);
		//console.log(pyongpyangScroll);
		//console.log(scroll);
		//console.log(pyongyangImg);
		//console.log(wonsan);
		//console.log(wonsanScroll);

	});

});