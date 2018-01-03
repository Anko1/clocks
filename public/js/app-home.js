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

        $('#cart-content').removeClass('active');
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
    });

    $('#cart').click(openCart);

    $('#cart-buy').click(buyCart);
});

const onPhoto = function () {
    const src = $($(this)[0]).find('img').attr('src');
    // console.log(src);
    $('#clock-photo-icon').attr('src', src);

    getClockFromServer($($(this)[0]).attr('data-clock-id')).then(function (clock) {
        // console.log('HERE =>', clock);

        $('#clock-photo').modal('open');

        $('#clock-photo-info').empty();
        $('#clock-photo-info').append(renderClock(clock));
    })
};

const getClockFromServer = function (id) {
    return new Promise(function(res, rej){
        $.get("http://localhost:8888/clock/" + id, {clocks: CART.join(',')}, function (answer) {
            // console.log(answer);
            res(answer)
        });
    });
};

const openCart = function () {
    const test = $('#cart-content').toggleClass('active');

    if ($(test[0]).css('display') !== 'none') {

        if (CART.length > 0) {
            $('#cart-content').removeClass('empty');

            $.get("http://localhost:8888/get-cart", {clocks: CART.join(',')}, function (answer) {
                console.log(answer);

                $('#cart-content').children('.cart-items').empty();

                answer.forEach(clock => {
                    const clockDom = renderClock(clock);

                    $('#cart-content').children('.cart-items').append(clockDom);
                })
            });
        }
        else $('#cart-content').addClass('empty');

    }
};

const buyCart = function () {
    $.get("http://localhost:8888/buy-cart", {clocks: CART.join(',')}, function (answer) {
        console.log(answer);

        CART.length = 0;
        $('#cart-content').removeClass('active');
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