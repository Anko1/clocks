$(function () {
    $('.clock-photos').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: $('#prev-clock'),
        nextArrow: $('#next-clock'),
        dots: true,
        centerMode: true
    });

    // console.log($('.color').length);
    initColors();

    $('form').click(function (e) {
        e.preventDefault();
    });
});

const initColors = () => {
    $('.color').each(function () {
        const color = $(this);

        color.css({background: color.attr('data-color')});
    })
};