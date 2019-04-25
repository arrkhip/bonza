;(function ($) {

    svg4everybody();

    var swiper = new Swiper('.redeemed-slider', {
      slidesPerView: 3,
      spaceBetween: 30,
      loop: true,
       navigation: {
        nextEl: '.redeemed-button-next',
        prevEl: '.redeemed-button-prev',
      },
      breakpoints: {
        992: {
          spaceBetween: 15,
        },
        768: {
          slidesPerView: 2,
        },
        540: {
          slidesPerView: 1,
          spaceBetween: 20,
        }
      }
    });

})(jQuery);