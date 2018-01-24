let CART = []
const cartText = $('#cart-count')

$(function () {
	try {
		CART = JSON.parse(getCookie('CART'))
	} catch (e) {
		console.log(e.message)
	}

	if(CART.length > 0) updateCartCount()


	$('.modal').modal()


	$('#cart').click(openCart.bind(null, false))

	$('#cart-buy').click(buyCart)

    $('#buy-form-close').click(function () {
        $('#buy-form').modal('close')
    })
})

const openCart = function (isOpen) {
	const test = isOpen ? $('#cart-content').addClass('active') : $('#cart-content').toggleClass('active')

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
	$('#buy-form').modal('open');
}

const updateCartCount = function (test) {
	if (CART.length > 0) {
		cartText.removeClass('empty')
		cartText.text(CART.length)
	} else {
		cartText.addClass('empty')
	}

	if(test) openCart(true)
}

const renderClockForCart = function (clock, bb) {
	const clockModel = clock.clockInfo
	const colorDom = $('<div class="color-wrapper">Color: <span class="color-dom"></span></div>')
	$(colorDom.find('span')[0]).css({background: clock.color})

	const deleteDom = $(`<button class="clock-delete" data-clock-id="${clock.id}"><i class="material-icons">close</i></button>`)

	const dom = $(
		`<div class="clock-cart-model">
            <img src="${clockModel.images[0] ? clockModel.images[0] : 'https://pbs.twimg.com/profile_images/821201216109559808/qchlustq.jpg'}" alt="" />
            <div class="clock-info">
                <span>${clockModel.name} | ${clockModel.price}$</span>
            </div>
        </div>`);

	$(dom.find('.clock-info')[0]).append(colorDom);
	deleteDom.click(deleteClockFromCart);

	dom.append(deleteDom);

	return dom
};

const deleteClockFromCart = function (e) {
	const self = $(this).parent()[0];
	const wrapper = $(self).parent()[0];

	const selfPos = Array.from($(wrapper).children()).indexOf(self);

	CART.splice(selfPos, 1);
	setCookie('CART', JSON.stringify(CART));

	updateCartCount(true);
	// $('#cart-content').removeClass('active');
};
