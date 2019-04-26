;(function ($) {

  svg4everybody();

  // slider 
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


  // accordion
  $(function () {
    var content = $('.js-accordion-body');
    var icon = $('.js-accordion-icon');
    
    $('.js-accordion-head').on('click', function() {
      // закрытие активного пункта при клике на следующий
      // content.not($(this).next()).slideUp(500);
      $(this).next().slideToggle(400);
      $(this).find($(icon)).toggleClass('active');

    });
  });


  // yandex map
  ymaps.ready(function(){
    var myMap = new ymaps.Map("map", {
      center: [54.723720, 55.943007],
      zoom: 14,
      controls: []
    });
    
    var myGeoObject = new ymaps.GeoObject({
      geometry: {
        type: "Point", 
        coordinates: [54.723720, 55.943007] 
      }
    });

    var myPlacemark = new ymaps.Placemark([54.723720, 55.943007], {}, {
      iconLayout: 'default#image',
      iconImageHref: '../img/map-flag.png',
      iconImageSize: [43, 60],
      iconImageOffset: [-3, -42]
    });

    myMap.geoObjects.add(myPlacemark);
    myMap.behaviors.disable('scrollZoom');
    
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      myMap.behaviors.disable('drag');
    }
  });


  //select2
  $('.js-select').select2({
    minimumResultsForSearch: Infinity
  });



  

})(jQuery);