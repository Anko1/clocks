let CART = []
const cartText = $('#cart-count')

$(function () {
    try {
        CART = JSON.parse(getCookie('CART'))
    } catch (e) {
        console.log(e.message)
    }

    if (CART.length > 0) updateCartCount()

    $('.multiple-items').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: true,
        prevArrow: $('#prev-clock'),
        nextArrow: $('#next-clock'),
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 360,
                settings: {
                    arrows: false,
                    slidesToShow: 1
                }
            }
        ]
    })

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
    })

    $('.modal').modal()

    $('#clock-photo-close').click(function (e) {
        $('#clock-photo').modal('close')
    })

    $('.photo').click(onPhoto)

    $('.clock-buy').click(onBuyBtn)

    //Triggers
    $(document).on('cart', function (e, clockId) {
        // console.log(clockId);

        updateCartCount()
    })

    $('#cart').click(openCart)

    $('#cart-buy').click(buyCart)

    $('#buy-form-close').click(function () {
        $('#buy-form').modal('close')
    })
});

const updateCartCount = function () {
    if (CART.length > 0) {
        cartText.removeClass('empty')
        cartText.text(CART.length)
    } else {
        cartText.addClass('empty')
    }
}

const onPhoto = function () {
    const src = $($(this)[0]).find('img').attr('src')
    // console.log(src);
    $('#clock-photo-icon').attr('src', src)

    getClockFromServer($($(this)[0]).attr('data-clock-id')).then(function (clock) {
        // console.log('HERE =>', clock);

        $('#clock-photo').modal('open')

        $('#clock-photo-info').empty()
        $('#clock-photo-info').append(renderClock(clock))
        $('#clock-photo-info').append(renderBuyBtn(clock.id ? clock.id : 0))
    })
}

const onBuyBtn = function (e) {
    const id = $(this).attr('data-clock-id')
    // CART.push(id);
    // setCookie('CART', JSON.stringify(CART))

    $(document).trigger('cart', id);

    $('#cart-content').removeClass('active')
};

const getClockFromServer = function (id) {
    return new Promise(function (res, rej) {
        $.get('http://localhost:8888/clock/' + id, {clocks: CART.join(',')}, function (answer) {
            // console.log(answer);
            res(answer)
        })
    })
}

const openCart = function () {
    const test = $('#cart-content').toggleClass('active')

    if ($(test[0]).css('display') !== 'none') {

        if (CART.length > 0) {
            $('#cart-content').removeClass('empty')

            $.post('http://localhost:8888/get-cart', {clocks: JSON.stringify(CART)}, function (answer) {
                console.log(answer)

                $('#cart-content').children('.cart-items').empty()

                answer.forEach(clock => {
                    const clockDom = renderClockForCart(clock)

                    $('#cart-content').children('.cart-items').append(clockDom)
                })
            })
        }
        else $('#cart-content').addClass('empty')

    }
}

const buyCart = function () {
    // $.get('http://localhost:8888/buy-cart', {clocks: CART.join(',')}, function (answer) {
    //   console.log(answer)
    //
    //   CART.length = 0
    //   $('#cart-content').removeClass('active')
    //
    //   updateCartCount()
    // })

    $('#buy-form').modal('open');
}

const renderClockForCart = function (clock, bb) {
    const clockModel = clock.clockInfo
    const colorDom = $('<div class="color-wrapper">Color: <span class="color-dom"></span></div>')
    $(colorDom.find('span')[0]).css({background: clock.color})

    const deleteDom = $(`<button class="clock-delete" data-clock-id="${clock.id}"><i class="material-icons">close</i></button>`)

    const dom = $(
        `<div class="clock-cart-model">
            <img src="${clockModel.images[0]}" alt="" />
            <div class="clock-info">
                <span>${clockModel.name} | ${clockModel.price}$</span>
            </div>
        </div>`);

    $(dom.find('.clock-info')[0]).append(colorDom);
    deleteDom.click(deleteClockFromCart);

    dom.append(deleteDom);

    return dom
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
    const dom = $(`<button class="clock-buy btn-floating waves-effect waves-gray right" data-clock-id="${index}"><i class="material-icons small">add_shopping_cart</i></button>`)
    dom.click(onBuyBtn)

    return dom
};

const deleteClockFromCart = function (e) {
    const self = $(this).parent()[0];
    const wrapper = $(self).parent()[0];

    const selfPos = Array.from($(wrapper).children()).indexOf(self);

    CART.splice(selfPos, 1);
    setCookie('CART', JSON.stringify(CART));

    updateCartCount();
    $('#cart-content').removeClass('active');
};
