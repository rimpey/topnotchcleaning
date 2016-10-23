$(document).ready(function() {
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

	// $('.navbar-toggler').on('click', function () {
	// 	if ($('.navbar-toggleable-xs').hasClass('in')) {
	// 		console.log('remove top margin');
	// 		$('body').css('margin-top', 0);
	// 	} else {
	// 		console.log($('nav').innerHeight());
	// 		$('body').css('margin-top', ($('nav').innerHeight() - 50) + 'px');
	// 		console.log('add top margin ' + ($('nav').innerHeight() - 50));
	// 	}
	// });

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
			navbody.css({paddingTop: height});
			//console.log(height);
			if (!navheader.hasClass('collapsing')) {
				clearInterval(interval);
			}
		}, 10);   
	});


});