
$(document).ready(function() {
    const lockModal = $("#lock-modal");
    const loadingCircle = $("#loading-circle");
    const form = $("#form form");


    form.on('submit', function(e) {
        //e.preventDefault(); //prevent form from submitting

        // lock down the form
        lockModal.css("display", "block");
        loadingCircle.css("display", "block");

        setTimeout(function() {
            // re-enable the form
            lockModal.css("display", "none");
            loadingCircle.css("display", "none");

        }, 3000);
    });

});