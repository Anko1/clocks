let CART = []
const cartText = $('#cart-count')
let CLOCK_COLOR = null

$(function () {
  try {
    CART = JSON.parse(getCookie('CART'))
  } catch (e) {
    console.log(e.message)
  }
  
  if(CART.length > 0) updateCartCount()
  
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
  })
  
  $('#buy-form').modal()
  $('#buy-form-close').click(function (e) {
    $('#buy-form').modal('close')
  })
  
  // console.log($('.color').length);
  initColors()
  
  $('.color').click(function (e) {
    const color = $(this).attr('data-color');
    
    CLOCK_COLOR = color
  })
  
  $('form').click(function (e) {
    e.preventDefault()
  })
  
  $('.buy-now').click(onBuyBtn)
  
  $(document).on("cart", function (e, clockId) {
    // console.log(clockId);
    
    updateCartCount();
  });

    $('#cart').click(openCart)

    $('#cart-buy').click(buyCart)
})

const updateCartCount = function () {
  if (CART.length > 0) {
    cartText.removeClass('empty');
    cartText.text(CART.length);
  } else {
    cartText.addClass('empty');
  }
};

const onBuyBtn = function (e) {
    const id = $(this).attr('data-clock-id');
    CART.push({
        id,
        color: CLOCK_COLOR
    });
    setCookie('CART', JSON.stringify(CART));

    $(document).trigger('cart', id);

    $('#cart-content').removeClass('active');
};

const initColors = () => {
  $('.color').each(function () {
    const color = $(this)
    
    color.css({background: color.attr('data-color')})
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

const deleteClockFromCart = function (e) {
    const self = $(this).parent()[0];
    const wrapper = $(self).parent()[0];

    const selfPos = Array.from($(wrapper).children()).indexOf(self);

    CART.splice(selfPos, 1);
    setCookie('CART', JSON.stringify(CART));

    updateCartCount();
    $('#cart-content').removeClass('active');
};
