const CART = [];
const cartText = $('#cart-count');

$(function () {
    $('.multiple-items').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        dots: true,
        prevArrow: $('#prev-clock'),
        nextArrow: $('#next-clock'),
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
                breakpoint: 320,
                arrows: false,
                variableWidth: true,
                settings: {
                    centerMode: true,
                    slidesToShow: 1
                }
            }
        ]
    });

    $('.p-wrap').slick({
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        centerMode: true,
        prevArrow: $('#prev-press'),
        nextArrow: $('#next-press'),
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

    $('#clock-photo').modal();

    $('#clock-photo-close').click(function (e) {
        $('#clock-photo').modal('close');
    });

    $('.photo').click(onPhoto);

    $('.clock-buy').click(onBuyBtn);

    //Triggers
    $(document).on("cart", function (e, clockId) {
        // console.log(clockId);

        updateCartCount();
    });

    $('#cart').click(openCart);

    $('#cart-buy').click(buyCart);
});

const updateCartCount = function () {
    if (CART.length > 0) {
        cartText.removeClass('empty');
        cartText.text(CART.length);
    } else {
        cartText.addClass('empty');
    }
};

const onPhoto = function () {
    const src = $($(this)[0]).find('img').attr('src');
    // console.log(src);
    $('#clock-photo-icon').attr('src', src);


    getClockFromServer($($(this)[0]).attr('data-clock-id')).then(function (clock) {
        // console.log('HERE =>', clock);

        $('#clock-photo').modal('open');

        $('#clock-photo-info').empty();
        $('#clock-photo-info').append(renderClock(clock));
        $('#clock-photo-info').append(renderBuyBtn(clock.id ? clock.id : 0));
    })
};

const onBuyBtn = function (e) {
    const id = $(this).attr('data-clock-id');
    CART.push(id);

    $(document).trigger('cart', id);

    $('#cart-content').removeClass('active');
};

const getClockFromServer = function (id) {
    return new Promise(function (res, rej) {
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

        updateCartCount();
    });
};

const renderClock = function (clock, bb) {
    const dom = $(`<div class="clock-cart-model">
        <img src="${clock.images[0]}" alt="" />
        <div class="clock-info">
        <span>${clock.name} | ${clock.price}$</span>
        </div>
        </div>`);

    return dom;
};

const renderBuyBtn = function (index) {
    const dom = $(`<button class="clock-buy btn-floating waves-effect waves-gray right" data-clock-id="${index}"><i class="material-icons small">add_shopping_cart</i></button>`);
    dom.click(onBuyBtn);

    return dom;
};