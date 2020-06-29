$(function () {
    $('.btn_collapse').on('click', function () {
        if ($(this).hasClass('collapsed')){
            $('#chatbot').show();
            $(this).removeClass('collapsed');
            $('#toggler').css({'left': '600'});
            $('#system_layout').css({'width': 'calc(100% - 600px)', 'left':'600px'});
            myLayout.updateSize($(window).width()-600, $(window).height());
            $(this).css('transform','translateX(-50%) translateY(-50%) rotate(0deg)')
        } else {
            $('#chatbot').hide();
            $(this).addClass('collapsed');
            $('#toggler').css({'left': '0'});
            $('#system_layout').css({'width': '100%', 'left':'20px'});
            myLayout.updateSize($(window).width()-20, $(window).height());
            $(this).css('transform','translateX(-50%) translateY(-50%) rotate(180deg)')
        }
    })

    $('._collapse').on('click', function () {
        if (!$(this).hasClass('open')) {
            $(this).siblings('.body').find('.list').show(500);
            $(this).addClass('open')
                .find('i').attr('class', 'fal fa-chevron-up');
        } else {
            $(this).siblings('.body').find('.list:gt(2)').hide(500);
            $(this).removeClass('open')
                .find('i').attr('class', 'fal fa-chevron-down');
        }

    })

    var mySwiper = null;
    function sliderInit() {
        mySwiper = new Swiper ('.swiper-container', {
            // Optional parameters
            loop: false,
            spaceBetween : 20
        })
        $('.button-prev').on('click', function () {
            mySwiper.slidePrev();
        })
        $('.button-next').on('click', function () {
            mySwiper.slideNext();
        })
    }


    $('.popup_wrap .close').on('click', function () {
        $('.popup_wrap').hide();
    });
    $('._help').on('click', function () {
        $('.popup_wrap._popup_help').show();
        if(mySwiper == null) {
            sliderInit();
        }
    });
    $('._setting').on('click', function () {
        $('.popup_wrap._popup_setting').show();
    });





});
