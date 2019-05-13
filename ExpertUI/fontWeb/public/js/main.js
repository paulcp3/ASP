window.onload = function(){
    window.mySwiper = new Swiper('.swiper-container',{
        slidesPerView: 4,
        spaceBetween: 30,
        autoplay:true,
        loop:true
    });
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    $(window).scroll(function(){
        if(document.documentElement.scrollTop > 50){
            $('.headerElse').css({display:"block"})
        }else{
            $('.headerElse').css({display:"none"})
        }
    })
    $('.goTop').click(function(){
        $(window).scrollTop(0)
    });
    $('.h-menuMain li').each(function(){ 
        $(this).click(function(){
            let i = $(this).index();
            $(this).addClass('active')
                    .siblings().removeClass('active');
        })
    })
    $('.nav-topItem').each(function(){ 
        $(this).click(function(){
            let i = $(this).index();
            $(this).addClass('active')
                    .siblings().removeClass('active');
            $('.nav-itemBox').eq(i).addClass('on')
                    .siblings().removeClass('on')

        })
    })
}