$(function () {
    $('.clock-photos').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: $('#prev-clock'),
        nextArrow: $('#next-clock'),
        dots: true,
        centerMode: true,
        responsive: [
            {
                breakpoint: 768,
                arrows: false,
                settings: {
                    centerMode: true,
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                arrows: false,
                settings: {
                    centerMode: true,
                    slidesToShow: 1
                }
            }
        ]
    });

    // console.log($('.color').length);
    initColors();

    $('form').click(function (e) {
        e.preventDefault();
    });

    $('.buy-now').click(function () {
        alert('Buy now!')
    })
});

const initColors = () => {
    $('.color').each(function () {
        const color = $(this);

        color.css({background: color.attr('data-color')});
    })
};