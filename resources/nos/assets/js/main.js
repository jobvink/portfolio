
$(document).ready(function(){
		$(function() {
		  $('a[href*="#"]:not([href="#"])').click(function() {
		    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
		      var target = $(this.hash);
		      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
		      if (target.length) {
		        $('html, body').animate({
		          scrollTop: target.offset().top
		        }, 1000);
		        return false;
		      }
		    }
		  });
		});

		window.sr = ScrollReveal();

		var config =  {
			origin: 'bottom',
			distance: '20px',
			mobile: true,
			reset: true,
			viewFactor: 0.2
		};

		sr.reveal('.col', { 
			duration: 200 ,
			origin: 'bottom',
			distance: '20px',
			mobile: true,
			reset: true,
			viewFactor: 0.2
		}, 10);

		sr.reveal('.zoom-graph', { 
			duration: 500 ,
			delay: 700,
			origin: 'bottom',
			distance: '20px',
			mobile: true,
			reset: true,
			viewFactor: 0.2
		});

		sr.reveal('.rule', { 
			duration: 300 ,
			delay: 100,
			origin: 'bottom',
			distance: '20px',
			mobile: true,
			reset: true,
			viewFactor: 0.2
		});
		
		if($("#card").flip()){
			$("#card3").flip()
		}
		if($("#card2").flip()){
			$("#card3").flip()
		}
		$("#card3").flip({
			precondition: function(){
				trigger : 'manual'
				if($("#card").flip.isFlipped){
					return false
				}
			}
		});


		$('#toggle-nav').click(function(e){
			e.preventDefault();
			$('#sidebar-wrapper').animate({width: '300px'}, 300);
			$('.dot-nav').animate({right: '30px'}, 300);
			$('nav').delay(500).css("display", "none");
			$('#hide-sidebar-icon').css("display", "block");
		});

		$('#hide-nav').click(function(e){
			e.preventDefault();
			hideMenu();
		});

		$('.sidebar-link').click(function(e){
			e.preventDefault();
			hideMenu();
		});

		function hideMenu(){
			
			$('#sidebar-wrapper').animate({width: '0px'}, 300);
			$('.dot-nav').animate({right: '30px'}, 300);
			$('nav')
			.delay(300)
			.queue(function (next) { 
			    $(this).css('display', 'block'); 
			    next(); 
			});

			$('#hide-sidebar-icon')
			.delay(300)
			.queue(function (next) { 
			    $(this).css('display', 'none'); 
			    next(); 
			});
		}


		var trigger_dot1 = $("#header-tekst").position().top;
		var trigger_dot2 = $("#toerisme").position().top - 2;
		var trigger_dot3 = $("#pyongyang").position().top - 2;
		var trigger_dot4 = $("#elite-scroll").position().top - 2;
		var trigger_dot5 = $("#wonsan").position().top - 2;

		console.log(trigger_dot3);
		console.log(trigger_dot4);

		$('#dot-1').addClass('dot-active');
		
		$(window).scroll(function(){
			var scroll = $(window).scrollTop();
			$('.dot-link').removeClass('dot-active');
			$('#dot-1').addClass('dot-active');

			if (scroll >= trigger_dot2 && scroll <= trigger_dot3){
				$('.dot-link').removeClass('dot-active');
				$('#dot-2').addClass('dot-active');
			}

			if (scroll >= trigger_dot3 && scroll <= trigger_dot4){
				$('.dot-link').removeClass('dot-active');
				$('#dot-3').addClass('dot-active');
			}

			if (scroll >= trigger_dot4 && scroll <= trigger_dot5){
				$('.dot-link').removeClass('dot-active');
				$('#dot-4').addClass('dot-active');
			}

			if (scroll >= trigger_dot5){
				$('.dot-link').removeClass('dot-active');
				$('#dot-5').addClass('dot-active');
			}
		});

		$('.dot-link').click(function(){
			$('.dot-link').removeClass('dot-active');
			$(this).addClass('dot-active');
		});
		
		var i = 0;

		$( "#playbutton" ).click(function() {
			if (i == 0){
				$("#video").click(function(){
				$("#playbutton").hide();
				});
				i = 1;
			} else {
				$("#video").click(function(){
				$("#playbutton").show();
				});
				i = 0;
			}			})
		
		$( "video" ).click(function() {
			if (i == 0){
				$("#video").click(function(){
				$("#playbutton").hide();
				});
				i = 1;
			} else {
				$("#video").click(function(){
				$("#playbutton").show();
				});
				i = 0;
			}	
		});

		resize();
		
		$(window).resize(function() {	
			resize();
		});

		function resize() {
			$("#playbutton").css("left", 	( ($(window).width() -  $("#playbutton").width()) / 2));
			$("#playbutton").css("top", 	( ($("#video").height() - $("#playbutton").height()) / 2));
			$("#scroll-down").css("left", 	( ($("header").width() - $("#scroll-down").width()) / 2));		
		}


});