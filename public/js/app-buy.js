$(function () {
    $('form').submit(function (e) {
        e.preventDefault();

        $.post('http://localhost:8888/submit-cart', { cart: getCookie('CART'), data: $(this).serialize() }, function (answer) {
            console.log(answer);
        })
    })
});