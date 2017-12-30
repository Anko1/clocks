const CART = [];
const cartText = $('#cart-count');

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

    $('.clock-buy').click(function (e) {
        const id = $(this).attr('data-clock-id');
        CART.push(id);

        $(document).trigger('cart', id);
    });

    //Triggers
    $(document).on("cart", function (e, clockId) {
        // console.log(clockId);

        if (CART.length > 0) {
            cartText.removeClass('empty');
            cartText.text(CART.length);
        } else {
            cartText.addClass('empty');
        }
    })

    $('#cart').click(openCart)

});

const onPhoto = function () {
    const src = $($(this)[0]).find('img').attr('src');
    // console.log(src);
    $('#clock-photo-icon').attr('src', src);

    $('#clock-photo').modal('open');
};

const openCart = function () {
    $.get("http://localhost:8888/cart", {clocks: CART.join(',')}, function (answer) {
        console.log(answer);

        $('#cart-content').empty();

        answer.forEach(clock => {
            const clockDom = renderClock(clock);

            $('#cart-content').append(clockDom);
        })

    });
};

const renderClock = function (clock) {
    const dom = $(`<div class="clock-cart-model">
<img src="${clock.images[0]}" alt="" />
<div>
<span>${clock.name} | ${clock.price}$</span>
</div>
</div>`);

    return dom;
};