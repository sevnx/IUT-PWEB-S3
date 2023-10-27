/* -------------------------------------------------- START -------------------------------------------------- */

(function() {
  "use strict";

  /* Selector helper function */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /* Event listener function */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /* OnScroll event listener */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /* NavbarLinks active state */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /* ScrollTo function */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /* Toggle .header-scrolled class to #header when page is scrolled */
  $("#agendaCards").on('click', () => {
    
    $('html, body').animate({
      scrollTop: $("#main").offset().top-100
    }, 0);
  })

  $("#agendaCards .col").hover((e) => {
    $("#agenda-title").removeClass()
    $("#agenda-title").addClass("left-" + $(e.currentTarget).data('pixbar'))
      console.log($(e.currentTarget).data('pixbar'));
  })

  let selectHeader = select('#header')
  if (selectHeader) {
    let scrolled = false
    const currentPage = window.location.pathname.split("/").pop();
    const headerScrolled = () => {
      if (window.scrollY < 450) {
        $("#agendaCards").css("margin-top", "calc(-11% + " + window.scrollY / 5 + "px)");
        $("#agendaCards").removeClass("scrolled");
      } else {
        $("#agendaCards").css("margin-top", "calc(-11% + 90px)");
        $("#agendaCards").addClass("scrolled");
      }

      if (window.scrollY > 200) {
        selectHeader.classList.add('header-scrolled');
        if (!scrolled) {
          $("#logoNavbar").fadeOut("fast", () => {
            const logoPath = currentPage === "index.html" ? 'src/assets/img/logo.png' : '../../assets/img/logo.png';
            $("#logoNavbar").attr('src', logoPath);
            $("#logoNavbar").fadeIn();
          });
          scrolled = true;
        }
      } else {
        selectHeader.classList.remove('header-scrolled');
        if (scrolled) {
          $("#logoNavbar").fadeOut("fast", () => {
            const logoPath = currentPage === "index.html" ? 'src/assets/img/favicon.png' : '../../assets/img/favicon.png';
            $("#logoNavbar").attr('src', logoPath);
            $("#logoNavbar").fadeIn();
          });
          scrolled = false;
        }
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /* BackToTop button */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /* Mobile nav toggle */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('active')
    this.classList.toggle('activated')
  })

  /* Mobile nav dropdowns activate */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('active')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /* Scroll with offset on links with a class name .scrollto */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /* Scroll with offset on page load with hash links in the url */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /* Preloader */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /* Initiate glightbox */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /* Porfolio isotope and filter */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.news-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#news-flters li', true);

      on('click', '#news-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }
  });

  /* Portfolio details slider */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /* Animation on scroll */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  });
})()

var swiper = new Swiper('.swiper-container', {
  slidesPerView: 1,
  spaceBetween: 10,
  loop: true,
  pagination: false,
  navigation: false,
  freeMode:true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  breakpoints: {
    680: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 20,
    }
  },
})

/* -------------------------------------------------- END -------------------------------------------------- */