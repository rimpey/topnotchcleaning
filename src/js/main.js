$(document).ready(function() {


	// *** Top Navigation
	// Click menu item to display slide panel

	$('.nav a').on('click', function (e) {
		e.preventDefault(); // prevent default link click event

        $(".nav a").removeClass("active"); // remove active class from all nav links
        $(this).addClass('active'); // add active class to this nav link only

		var slide = $(this.hash); // e.g. $('#slide1')
		if (slide.length) {	// a slide exists with this id
			var offsetTop = slide.offset().top - height; // get position of top of slide
           	// animate to top of slide over 1000 milliseconds
  			$('html, body').animate({scrollTop: offsetTop}, 1000);
        }
	});


	// *** Hamburger Menu
	// code to re-adjust top of slide to correspond with height of hamburger menu so that
	// on clicking menu item the top line isn't lost under the height of menu

	var navbar = $('.navbar');
	var navheader = $('#topnotch-menu');
	var navbody = $('body');

	// See this for explanation on height, innerHeight and outerHeight :)
	// http://www.texelate.co.uk/blog/post/91-jquery-whats-the-difference-between-height-innerheight-and-outerheight/
	// Set the padding on the body based on the inital height of the navbar
	var height = navbar.outerHeight();
	navbody.css({paddingTop: height});   // can do .css with string property or JS object.  Don't need to put + 'px' actually

	$('.navbar-toggler').on('click', function () {
		var interval = setInterval(function () {
			height = navbar.outerHeight();
			// add height of hamburger menu to push slide down to view first line
			navbody.css({paddingTop: height});
			//console.log(height);
			if (!navheader.hasClass('collapsing')) {
				clearInterval(interval);
			}
		}, 10);   
	});


	// *** Request Quote form
	// make sure input fields in same height row are also the same height
	// Get the y-coordinate of the bottom of the phone input
	var phoneInput = $('#input-phone');
	var bottomOfPhone = phoneInput.position().top + phoneInput.height();
	// Set the textare height to bottom of phone input - top of textarea
	var messageInput = $('#input-message');
	messageInput.height(bottomOfPhone - messageInput.position().top);


	// *** Form Validation ***
	$("form").validate({

		// Rules
		rules: {
			name: {
				required: true
			},
			email: {
				required: true,
				email: true // ensure correct format
			},
			phone: {
				required: true
			},
			message: {
				required: true
			}
		},
		highlight: function(usrinput) {
			$(usrinput).parent().addClass("has-danger");
		},
		unhighlight: function(usrinput) {
			$(usrinput).parent().removeClass("has-danger");
		},
		errorPlacement: function(error, element) {
			// leave empty to avoid default error msg
		},	

		// Submit Handler
		submitHandler: function(form) {

			$.ajax({
				type: "POST",
				url: "https://formspree.io/topnotchclean1@hotmail.com", 
				data: $(form).serialize(),
				dataType : "json",
				
				success: function(result){
					console.log("submit handler ajax success");
					$("form").fadeOut(1000, function(){
						$("#success_message").removeClass("hidden-sm-up").fadeIn();
					});
				},

				fail: function(result){
					console.log("submit handler ajax fail");
				}
			})
		}
	});

	//*** Form Validation 
	// JQuery Validation without AJAX takes user off Web Page
	// var constraints = {
	// 	rules: {
	// 		name: {
	// 			required: true
	// 		},
	// 		email: {
	// 			required: true,
	// 			email: true // ensure correct format
	// 		},
	// 		phone: {
	// 			required: true
	// 		},
	// 		message: {
	// 			required: true
	// 		}
	// 	},
	// 	// errorClass: "has-danger", // either errorClass property or just refer to errorClass directly as follows
	// 	highlight: function(usrinput) {
	// 		$(usrinput).parent().addClass("has-danger");
	// 	},
	// 	unhighlight: function(usrinput) {
	// 		$(usrinput).parent().removeClass("has-danger");
	// 	},
	// 	errorPlacement: function(error, element) {
    // 		leave empty to avoid default error msg
  	// 	}	
	// }

	// call validation on form passing constraints object
	// $("form").validate(constraints);	
});