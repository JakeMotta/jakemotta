$(document).ready(function(){

  // https://bulma.io/documentation/components/navbar/
  // Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach(function ($el) {
      $el.addEventListener('click', function () {

        // Get the target from the "data-target" attribute
        var target = $el.dataset.target;
        var $target = document.getElementById(target);

        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        $el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }

  $('.navbar-item').click(function() {
    $('.navbar-burger').removeClass('is-active');
    $('.navbar-menu').removeClass('is-active');
  });

  // scroll animations
  new WOW().init();

  // smoothscroll
  var scroll = new SmoothScroll('a[href*="#"]');

  // nav styles
  $(document).scroll(function () {
    var $nav = $(".is-fixed-top");
    $window = $(window);
    var socializeDistance = $('#socialize').offset().top -1;
    var influenceDistance = $('#influence').offset().top -1;
    var discoverDistance = $('#discover').offset().top -1;
    var footerDistance = $('#footer').offset().top -1;

    // nav background
    $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
    if ($window.scrollTop() >= influenceDistance ) {
      if($nav.hasClass("is-dark")) {
        $nav.removeClass("is-dark").addClass("is-light");
      }
    }
    else {
      if($nav.hasClass("is-light")) {
        $nav.removeClass("is-light").addClass("is-dark");
      }
    }

    // active-sections
    if($window.scrollTop() >= socializeDistance && $window.scrollTop() < influenceDistance) {
      $(".is-nav-link").not('[href$="#socialize"]').removeClass("is-active");
      $('.is-nav-link[href$="#socialize"]').addClass('is-active');
    }
    else if($window.scrollTop() >= influenceDistance && $window.scrollTop() < discoverDistance) {
      $(".is-nav-link").not('[href$="#influence"]').removeClass("is-active");
      $('.is-nav-link[href$="#influence"]').addClass('is-active');
    }
    else if($window.scrollTop() >= discoverDistance && $window.scrollTop() < footerDistance) {
      $(".is-nav-link").not('[href$="#discover"]').removeClass("is-active");
      $('.is-nav-link[href$="#discover"]').addClass('is-active');
    }
    else {
      $(".is-nav-link").removeClass('is-active');
    }
  });

  // count up
  $('.counter').counterUp({
    delay: 100,
    time: 500,
    offset: 70,
    beginAt: 0
  });
});