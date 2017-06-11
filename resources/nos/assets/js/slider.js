$(document).ready(function(){

	var sl1 = $("#slider1");
	var sl2 = $("#slider2");
	var sl3 = $("#slider3");
	var sl4 = $("#slider4");

	var nav1 = $("#slider-nav-1");
	var nav2 = $("#slider-nav-2");
	var nav3 = $("#slider-nav-3");
	var nav4 = $("#slider-nav-4");

	var butt1 = $("#slider-nav-button-1");
	var butt2 = $("#slider-nav-button-2");
	var butt3 = $("#slider-nav-button-3");
	var butt4 = $("#slider-nav-button-4");

	var img1 = document.getElementById("slider-nav-img-1");
	var img2 = document.getElementById("slider-nav-img-2");
	var img3 = document.getElementById("slider-nav-img-3");
	var img4 = document.getElementById("slider-nav-img-4");

	var prefElement;
	var currElement = sl1;

	var prefButt;
	var currButt = butt1;

	var prefImg
	var currImg = img1;

	butt1.css("background-color", "#DE4F42");
	butt2.css("background-color", "white");
	butt3.css("background-color", "white");
	butt4.css("background-color", "white");

	sl1.show();
	sl2.hide();
	sl3.hide();
	sl4.hide();

	nav1.on("click", function(){
		showSlider(sl1);
	});

	nav2.on("click", function(){
		showSlider(sl2);
	});

	nav3.on("click", function(){
		showSlider(sl3);
	});

	nav4.on("click", function(){
		showSlider(sl4);
	});

	butt1.on("click", function(){
		showSlider(sl1);
	});

	butt2.on("click", function(){
		showSlider(sl2);
	});

	butt3.on("click", function(){
		showSlider(sl3);
	});

	butt4.on("click", function(){
		showSlider(sl4);
	});

	nav1.mouseenter(function(){
		if (currElement != sl1) {
			img1.src = "assets/img/slider/dolfinarium3_klein.jpg";
		}
	})

	nav1.mouseleave(function(){
		if (currElement != sl1) {
			img1.src = "assets/img/slider/dolfinarium3_klein_blauw.jpg";
		}
	})
	
	nav2.mouseenter(function(){
		if (currElement != sl2) {
			img2.src = "assets/img/slider/gebouwen_klein.jpg";
		}
	})

	nav2.mouseleave(function(){
		if (currElement != sl2) {
			img2.src = "assets/img/slider/gebouwen_klein_blauw.jpg";
		}
	})
	
	nav3.mouseenter(function(){
		if (currElement != sl3) {
			img3.src = "assets/img/slider/pretpark_klein.jpg";
		}
	})

	nav3.mouseleave(function(){
		if (currElement != sl3) {
			img3.src = "assets/img/slider/pretpark_klein_blauw.jpg";
		}
	})
	
	nav4.mouseenter(function(){
		if (currElement != sl4) {
			img4.src = "assets/img/slider/paardrijdennk1_klein.jpg";
		}
	})

	nav4.mouseleave(function(){
		if (currElement != sl4) {
			img4.src = "assets/img/slider/paardrijdennk1_klein_blauw.jpg";
		}
	})

	function showSlider(sliderObject) {
		if (currElement != sliderObject) {
			sliderObject.show();
			prefElement = currElement;
			currElement = sliderObject;
			prefElement.hide();

			var button = getButtonObject(sliderObject);
			button.css("background-color", "#DE4F42");
			prefButt = currButt;
			currButt = button;
			prefButt.css("background-color", "white");

			var sliderImg = getSliderImg(sliderObject);
			prefImg = currImg;
			currImg = sliderImg;
			prefImg.src = getFilterdImagePath(prefImg);
			currImg.src = getImagePath(currImg);

		}
	}

	resize();

	function getButtonObject(sliderObject) {
		if (sliderObject == sl1) {
			return butt1;
		} else if (sliderObject == sl2) {
			return butt2;
		} else if (sliderObject == sl3) {
			return butt3;
		} else if (sliderObject == sl4) {
			return butt4;
		}
	}

	function getSliderImg(sliderObject) {
		if (sliderObject == sl1) {
			return img1;
		} else if (sliderObject == sl2) {
			return img2;
		} else if (sliderObject == sl3) {
			return img3;
		} else if (sliderObject == sl4) {
			return img4;
		}
	}

	function getImagePath(imgObject) {
		if (imgObject == img1)  {
			return "assets/img/slider/dolfinarium3_klein.jpg";
		} else if (imgObject == img2) {
			return "assets/img/slider/gebouwen_klein.jpg";
		} else if (imgObject == img3) {
			return "assets/img/slider/pretpark_klein.jpg";
		} else if (imgObject == img4) {
			return "assets/img/slider/paardrijdennk1_klein.jpg";
		}
	}

	function getFilterdImagePath(imgObject) {
		if (imgObject == img1)  {
			return "assets/img/slider/dolfinarium3_klein_blauw.jpg";
		} else if (imgObject == img2) {
			return "assets/img/slider/gebouwen_klein_blauw.jpg";
		} else if (imgObject == img3) {
			return "assets/img/slider/pretpark_klein_blauw.jpg";
		} else if (imgObject == img4) {
			return "assets/img/slider/paardrijdennk1_klein_blauw.jpg";
		}
	}

	$(window).resize(function() {
		resize();
	});

	function resize() {
		$("#slider-nav-buttons").css("margin-left", ( ($(window).width() -  $("#slider-nav-buttons").width()) / 2));
		$("#slider-nav-buttons").css("margin-top", ( $("#wrapper").height() * 0.875));
	}

});



