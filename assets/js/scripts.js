// @codekit-prepend  "_jquery.imageGallery.js", "_jquery.matchHeight.js", "_formular-button.js";


/**
 * Welches Js ist für was?
 *
 * _jquery.imageGallery.js => Bilder Gallery mit Overlay
 * _superfish.js => Navigation
 * _easyaspie-overlay.js => Navigation
 * _jquery.matchHeight.js => Höhenanpassung von Containern
 *
 */

// Ausführen, wenn Website geladen wurde
$(document).ready(function() {

    /* *********************************************************************************************************************** */

    // Accordion => on click alle anderen schliessen
    var checkboxElements = $( ".accordion-checkbox" ), clickId = '';

    $('.accordion > label').click(function() {
        clickId = $(this).parent().find(checkboxElements).attr('id');

        $(this).next('.accordion-content').slideDown('slow');

        $.each(checkboxElements, function(){

            if ( $(this).attr('id') != clickId){
                $(this).prop("checked", false);
                $(this).next().next('.accordion-content').slideUp('slow');
            } else {
                if ($(this).prop("checked")) {
                    $('#' + clickId).checked = false;
                    $(this).next().next('.accordion-content').slideUp('slow');
                }
            }

        });

    });


    /* *********************************************************************************************************************** */

    /**
     *  Links Phone Number
     *  Demo Einbettung: => <a class="cursor"  href="tel:567898">Telefon</a>
     */


    if ($("body").hasClass( "is-desktop" )) {

        var phone = $('[href^="tel"]');
        var telNummer = '';

        phone.each(function () {

            if($(this).attr("data-tel") !== undefined ){

                var currentElement  = $(this), NewTelNummer = '';

                //var currentElement  = tel = currentElement.attr('href'), telNummer = '';
                //telNummer = tel.split(':');
                //telNummer = telNummer[1];

                NewTelNummer = $(this).attr("data-tel");
                NewTelNummer = NewTelNummer.trim();

                phoneNumber     = currentElement.html(),
                newPhoneElement = $('<i class="cursor" onclick="openPhonelayer(\'' + NewTelNummer + '\')"></i>');
                currentElement.before(newPhoneElement);
                newPhoneElement.html(phoneNumber);
                currentElement.remove();
            }

            if($(this).attr("data-tel") === undefined ){

                var currentElement  = $(this), myClassname = $(this).attr('class'), dataTooltip = $(this).attr("data-tooltip"), phoneNumber;

                if(typeof myClassname == 'undefined' || myClassname == ''){
                    phoneNumber     = currentElement.html(), newPhoneElement = $('<i></i>');
                } else if(dataTooltip && dataTooltip != '') {
                    phoneNumber     = currentElement.html(), newPhoneElement = $('<i class="' + myClassname + '" data-tooltip="' + dataTooltip  + '"></i>');
                }else {
                    phoneNumber     = currentElement.html(), newPhoneElement = $('<i class="' + myClassname + '"></i>');
                }

                currentElement.before(newPhoneElement);
                newPhoneElement.html(phoneNumber);
                currentElement.remove();
            }

        });
    }


    /* *********************************************************************************************************************** */

    /**
     *  PHP Function gibt eMail aus zum Verhindern von Spam codiert aus.
     *
     *  Javascript wandelt folgende Elemente wieder um:
     *  - mail-to => mailto
     *  - (wolpertinger) => @
     *  - (noagerl) => .
     *
     */

    /*
    $(function() {

        $('a[href^="mail-to:"]').each(function() {

            this.href = this.href.replace('(wolpertinger)', '@').replace(/\(noagerl\)/g, '.');

            eMail = this.href.split(':');
            emailMailto = eMail[0];
            emailAddress = eMail[1];
            emailText = $(this).text();

            newHref = $(this).attr('href').replace('mail-to:', 'mailto:');
            this.href = newHref;

            if( emailText.indexOf("(wolpertinger)") != -1 ){
                this.innerHTML = this.href.replace('mailto:', '');
            } else {
                this.html = emailAddress;
            }

        });

    });
    */


    /**
     * Scroll To Top - Button
     ***************************************************************************************
     */
    /*
    // Der Button wird mit JavaScript erzeugt und vor dem Ende des body eingebunden.
    var back_to_top_button = ['<a href="#top" class="back-to-top">Top</a>'].join("");
    $("body").append(back_to_top_button)

    // Der Button wird ausgeblendet
    $(".back-to-top").hide();

    // Funktion für das Scroll-Verhalten
    $(function () {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 600) { // Wenn 100 Pixel gescrolled wurde
                $('.back-to-top').fadeIn();
            } else {
                $('.back-to-top').fadeOut();
            }
        });

        $('.back-to-top').click(function () { // Klick auf den Button
            $('body,html').animate({
                scrollTop: 0
            }, 800);
            return false;
        });
    });
    */


    /* *********************************************************************************************************************** */

    /**
     * Accordion
     * @type {jQuery|HTMLElement|*}
     */

    var accordionList = $('.accordion-list'), accList, accListID;

    accordionList.each(function( index ) {
        accList = $( this ).children('li');
        accList.children('.accordion-content').hide();
    });

    $('.accordion-list > li').click(function() {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active").find(".accordion-content").slideUp();
        } else {
            $(".accordion-list > li.active .accordion-content").slideUp();
            $(".accordion-list > li.active").removeClass("active");
            $(this).addClass("active").find(".accordion-content").slideDown();

            var element = $(this);

            setTimeout(function() {
                $('body, html').animate({
                    scrollTop: element.offset().top
                }, 500)
            }, 400);

        }
        return false;
    });
    
    /* *********************************************************************************************************************** */

    /**
     * Preload Animation Startseite
    */

    if (sessionStorage.getItem('dontLoad') == null) {
        $(".preloader").delay(4000).fadeOut();
        sessionStorage.setItem('dontLoad', 'true');
    } else {
        $(".preloader").hide();
    }

    /* *********************************************************************************************************************** */

    var display_width = $(window).width(), hamburger = $("#hambuger_menu"), menu = $("#myNav"), myBody = $("body"), spalte = $(".sp3-inner-re");

    $(hamburger).click(function (e) {
        menu.toggleClass("open on");
        hamburger.toggleClass("open");
        myBody.toggleClass("bodyStatus");
        spalte.toggleClass("open");
    });


    /* *********************************************************************************************************************** */

    setTimeout(function() {
        resizeMenue();
    }, 100);

    /* *********************************************************************************************************************** */

    /**
     * resize
     */

    $(window).resize(function() {
        setTimeout(function() {
            resizeMenue();
        }, 50);
    })
    /* *********************************************************************************************************************** */

    $(window).bind('orientationchange', function (event) {
        location.reload(true);
    });


    /* *********************************************************************************************************************** */



   $('.teamName').matchHeight();
   $('.teamPosition').matchHeight();
   $('.teamTel').matchHeight();
   $('.teamMail').matchHeight();




    /* *********************************************************************************************************************** */
    /* *********************************************************************************************************************** */
    /* *********************************************************************************************************************** */

    // Font-Tester | Boxen zwischen allen Tags für Bestimmen des Minus-Margins (Settings) – nach erfolgreichem Testen löschen
    /*
    $('main').children().each(function () {
        $(this).find('*').before("<div style='background: #eee; height: 50px'></div>");
    });
    */


    /* *********************************************************************************************************************** */
    /* *********************************************************************************************************************** */
    /* *********************************************************************************************************************** */


}); /* END  $(document).ready(function()  */


/* *************************************************************************************************************************
 *  Funktionen
 * *********************************************************************************************************************** */

/* *********************************************************************************************************************** */

/**
 * öffnet bei Media Querie Desktop (on click) einen Layer mit der Telefon Nummer
 * Telefon Nummer wir per function-Value übergeben
 * bei Media Querie Mobile ist die Telefonnummer clickbar.
 * @param tel
 */

/*
function openPhonelayer(tel) {
    $('.phonelayer').show();
    $('#overlay-tel').text(tel);
}

function closePhonelayer() {
    $('.phonelayer').hide();
}
*/

/* *********************************************************************************************************************** */

/**
 *
 * Cookies Setzen und Auslesen
 *
 * @param name
 * @param value
 * @param days
 * @returns {string}
 */


function setCookie(name, value, days) {
    var d = new Date();
    //days = days
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + value + ";days=" + d.toUTCString() + ";path=/";
    return getCookie(name);
};



function getCookie(name) {
    var ca = decodeURIComponent(document.cookie).split(";");
    name += "=";
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
};

/* *********************************************************************************************************************** */


function resizeMenue() {
    var width ;
    width = $(window).width();
    width = parseInt( width );
    if( width <= 1300){
        $('#myNav').addClass( "overlay" ).css('display', '');
        $('#myNav').removeClass('open');
        $('#hambuger_menu').removeClass('open');
        $('body').removeClass('bodyStatus');
        setTimeout(function() {
            $('#myNav').addClass( "overlay-status" );
        }, 1000);
    } else {
        $('#myNav').removeClass( "overlay open overlay-status" ).css('display', 'flex');
        $('#hambuger_menu').removeClass('open');
        $('body').removeClass('bodyStatus');
    }
}


/* *********************************************************************************************************************** */

