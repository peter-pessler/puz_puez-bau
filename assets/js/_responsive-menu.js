/* 
Ace Responsive Menu Plugin
Version: 1.0
Author: Samson.Onna 
Email : samson3d@gmail.com
Website: www.webthemez.com
----------------------------------------*/

(function ($) {
    $.fn.aceResponsiveMenu = function (options) {

        //plugin's default options
        var defaults = {
            resizeWidth: '800',
            animationSpeed: 'fast',
            accoridonExpAll: false
        };

        //Variables
        var options = $.extend(defaults, options),
            opt = options,
            $resizeWidth = opt.resizeWidth,
            $animationSpeed = opt.animationSpeed,
            $expandAll = opt.accoridonExpAll,
            $aceMenu = $(this),
            $menuStyle = $(this).attr('data-menu-style');

        // Initilizing        
        $aceMenu.find('ul').addClass("sub-menu");
       // $aceMenu.find('ul').siblings('a').append('<span class="arrow "></span>');
        if ($menuStyle == 'accordion') { $(this).addClass('collapse'); }

        // Window resize on menu breakpoint 
        if ($(window).innerWidth() <= $resizeWidth) {
            menuCollapse();
        }
        $(window).resize(function () {
            menuCollapse();
        });

        // Menu Toggle
        function menuCollapse() {
            var w = $(window).innerWidth();
            if (w <= $resizeWidth) {
                $aceMenu.find('li.menu-active').removeClass('menu-active');
                $aceMenu.find('ul.slide').removeClass('slide').removeAttr('style');
                $aceMenu.addClass('collapse hide-menu');
                $aceMenu.attr('data-menu-style', '');
                $('.menu-toggle').show();
            } else {
                $aceMenu.attr('data-menu-style', $menuStyle);
                $aceMenu.removeClass('collapse hide-menu').removeAttr('style');
                $('.menu-toggle').hide();
                if ($aceMenu.attr('data-menu-style') == 'accordion') {
                    $aceMenu.addClass('collapse');
                    return;
                }
                $aceMenu.find('li.menu-active').removeClass('menu-active');
                $aceMenu.find('ul.slide').removeClass('slide').removeAttr('style');
            }
        }

        //ToggleBtn Click
        $('#menu-btn').click(function () {
            $aceMenu.slideToggle().toggleClass('hide-menu');
        });


        // Main function 
        return this.each(function () {
            // Function for Horizontal menu on mouseenter
            $aceMenu.on('mouseover', '> li a', function () {
                if ($aceMenu.hasClass('collapse') === true) {
                    return false;
                }
               // $(this).off('click', '> li a');
                $(this).parent('li').siblings().children('.sub-menu').stop(true, true).slideUp($animationSpeed).removeClass('slide').removeAttr('style').stop();
                $(this).parent().addClass('menu-active').children('.sub-menu').slideDown($animationSpeed).addClass('slide');
                return;
            });
            $aceMenu.on('mouseleave', 'li', function () {
                if ($aceMenu.hasClass('collapse') === true) {
                    return false;
                }
                $(this).off('click', '> li a');
                $(this).removeClass('menu-active');
                $(this).children('ul.sub-menu').stop(true, true).slideUp($animationSpeed).removeClass('slide').removeAttr('style');
                return;
            });
            //End of Horizontal menu function

            // Function for Vertical/Responsive Menu on mouse click
            $aceMenu.on('click', '> li a', function () {
                if ($aceMenu.hasClass('collapse') === false) {
                    //return false;
                }
                $(this).off('mouseover', '> li a');
                if ($(this).parent().hasClass('menu-active')) {
                    $(this).parent().children('.sub-menu').slideUp().removeClass('slide');
                    $(this).parent().removeClass('menu-active');
                } else {
                    if ($expandAll == true) {
                        $(this).parent().addClass('menu-active').children('.sub-menu').slideDown($animationSpeed).addClass('slide');
                        return;
                    }
                    $(this).parent().siblings().removeClass('menu-active');
                    $(this).parent('li').siblings().children('.sub-menu').slideUp().removeClass('slide');
                    $(this).parent().addClass('menu-active').children('.sub-menu').slideDown($animationSpeed).addClass('slide');
                }
            });
            //End of responsive menu function

        });
        //End of Main function

    }
})(jQuery);





$( document ).ready(function() {


    $("#nav").aceResponsiveMenu({
        resizeWidth: '768', // Set the same in Media query
        animationSpeed: 'fast', //slow, medium, fast
        accoridonExpAll: false //Expands all the accordion menu on click
    });




    $( "#nav" ).each(function( index ) {
        $(this).find('ul.child').parent().children("a").removeAttr("href");
        $(this).find('ul.child').parent().children("a").addClass('hasChild');
        $(this).find('ul.child').parent().children("a").parent().addClass('hasChild');
    });


    setTimeout(function() {
        menue_width($('#nav  .level-1 li'));
    }, 100);


    $(window).resize(function() {

        setTimeout(function() {
            menue_clear($('#nav  .level-1 li'));
            menue_width($('#nav  .level-1 li'));
        }, 50);

    })

});


function menue_width(element) {
    var widest_element = 0;

    $( "#nav" ).css("overflow", "hidden");


    // Lösche die Breite
    element.each(function () {
        $(this).removeAttr('style');
        $(this).parent().show();
    });

    // Prüfe, welches Element am breitesten ist
    element.each(function () {
        if ($(this).outerWidth(true) > widest_element) {
            widest_element = $(this).outerWidth(true);
        }
    });

    // Weise diese Breite allen Elementen zu / zum Berechnen ist ul auf block und wird danach auf none gesetzt.

    var width ;
    width = $(window).width();
    width = parseInt( width );
    if( width <= 800){
        element.each(function () {
            $(this).css("width",  "100%");
            $(this).parent().hide();
        });
    } else {
        element.each(function () {
            $(this).css("width", widest_element + "px");
            $(this).parent().hide();
        });
    }

    $( "#nav" ).removeAttr('style');

};

function menue_clear(element) {

    // Entfernt alle Styles von aufgeklappten Elementen

    $('#nav li').each(function () {
        $(this).removeClass('menu-active');
    });

    element.each(function () {
        $(this).hide();
    });

}
