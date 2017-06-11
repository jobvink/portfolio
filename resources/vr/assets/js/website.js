/**
 * Created by bas on 11/01/2017.
 */

$(function() {

    $('a.page-scroll').click(function(e) {
        e.preventDefault();
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top-40
                }, 900);
                return false;
            }
        }
    });

    $('body').scrollspy({
        target: '.navbar',
        offset: 80
    });

    $('#afrekenen').on('click', function () {
        $('#checkoutmsg').html('Wat leuk dat je gelijk wilt afrekenen, helaas kan dit niet in de DEMO versie');
    });
});