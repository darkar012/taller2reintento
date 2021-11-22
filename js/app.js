if (screen.width > 500) {
    var swiper = new Swiper('.swiper', {
        effect: 'coverflow',
        grabCursor: true,
        loop: true,
        centeredSlides: true,
        slidesPerView: '3',
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: true,
        },
        pagination: {
            el: '.swiper-pagination',
        },
    });
} else if (screen.width <= 500) {
    var swiper = new Swiper('.swiper', {
        effect: 'coverflow',
        grabCursor: true,
        loop: true,
        centeredSlides: true,
        slidesPerView: '2',
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: true,
        },
        pagination: {
            el: '.swiper-pagination',
        },
    });
}

var yolo = new Swiper(".mySwiper", {
    effect: "fade",
    loop: true,
    autoplay: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    }
});