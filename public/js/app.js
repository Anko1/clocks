$(function () {
	$('.multiple-items').slick({
								   infinite: true,
								   slidesToShow: 3,
								   slidesToScroll: 1,
								   prevArrow: $('#prev-clock'),
								   nextArrow: $('#next-clock'),
								   // variableWidth: true
							   });

	$('.p-wrap').slick({
						   slidesToShow: 1,
						   slidesToScroll: 1,
						   infinite: true,
						   prevArrow: $('#prev-press'),
						   nextArrow: $('#next-press'),
						   responsive: [
							   {
								   breakpoint: 768,
								   settings: {
									   arrows: false,
									   centerMode: true,
									   centerPadding: '40px',
									   slidesToShow: 1
								   }
							   },
							   {
								   breakpoint: 480,
								   settings: {
									   arrows: false,
									   centerMode: true,
									   centerPadding: '40px',
									   slidesToShow: 1
								   }
							   }
						   ]
					   });

	$('.modal').modal();

	$('.photo').click(onPhoto);
});

const onPhoto = function() {
	const src = $($(this)[0]).find('img').attr('src');
	// console.log(src);
	$('#clock-photo-icon').attr('src', src);

	$('#clock-photo').modal('open');
};

