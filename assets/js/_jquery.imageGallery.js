(function(){

	/* Private variables */
	
	var overlay = $('<div id="galleryOverlay" data-count="">'),
		slider = $('<div id="gallerySlider">'),
		prevArrow = $('<a id="prevArrow"></a>'),
		nextArrow = $('<a id="nextArrow"></a>'),
		overlayVisible = false;
		


	/* Creating the plugin */
	
	$.fn.imageGallery = function(){

		var placeholders = $([]),
			index = 0,
			allitems = this,
			items = allitems;

		// Appending the markup to the page
		overlay.hide().appendTo('body');
		slider.appendTo(overlay);
		
		// Creating a placeholder for each image
		items.each(function(){
			placeholders = placeholders.add($('<div class="placeholder">'));
		});
	
		// Hide the gallery if the background is touched / clicked

		slider.append(placeholders).on('click',function(e){

			if(!$(e.target).is('img')){
				hideOverlay();
			}
		});
		
		// Listen for touch events on the body and check if they
		// originated in #gallerySlider img - the images in the slider.
		$('body').on('touchstart', '#gallerySlider img', function(e){
			
			var touch = e.originalEvent,
				startX = touch.changedTouches[0].pageX;
	
			slider.on('touchmove',function(e){
				
				e.preventDefault();
				
				touch = e.originalEvent.touches[0] ||
						e.originalEvent.changedTouches[0];
				
				if(touch.pageX - startX > 10){

					slider.off('touchmove');
					showPrevious();
				}

				else if (touch.pageX - startX < -10){

					slider.off('touchmove');
					showNext();
				}
			});

			// Return false to prevent image 
			// highlighting on Android
			return false;
			
		}).on('touchend',function(){

			slider.off('touchmove');

		});
		
		// Listening for clicks on the thumbnails
		items.on('click', function(e){

			e.preventDefault();

			var $this = $(this),
				galleryName,
				selectorType,
				$closestGallery = $this.parent().closest('[data-gallery]');

			// Find gallery name and change items object to only have 
			// that gallery

			//If gallery name given to each item
			if ($this.attr('data-gallery')) {

				galleryName = $this.attr('data-gallery');
				selectorType = 'item';

			//If gallery name given to some ancestor
			} else if ($closestGallery.length) {

				galleryName = $closestGallery.attr('data-gallery');
				selectorType = 'ancestor';

			}

			//These statements kept seperate in case elements have data-gallery on both
			//items and ancestor. Ancestor will always win because of above statments.
			if (galleryName && selectorType == 'item') {

				items = $('[data-gallery='+galleryName+']');

			} else if (galleryName && selectorType == 'ancestor') {

				//Filter to check if item has an ancestory with data-gallery attribute
				items = items.filter(function(){

           			return $(this).parent().closest('[data-gallery]').length;    
           			
           		});

			}

			// Find the position of this image
			// in the collection
			index = items.index(this);
			showOverlay(index);
			showImage(index);
			
			// Preload the next image
			preload(index+1);
			
			// Preload the previous
			preload(index-1);
			
		});
		
		// If the browser does not have support 
		// for touch, display the arrows
		//if ( !("ontouchstart" in window) ){
			overlay.append(prevArrow).append(nextArrow);
			
			prevArrow.click(function(e){
				e.preventDefault();
				showPrevious();
			});
			
			nextArrow.click(function(e){
				e.preventDefault();
				showNext();
			});
		//}
		
		// Listen for arrow keys
		$(window).bind('keydown', function(e){
		
			if (e.keyCode == 37) {
				showPrevious();
			}

			else if (e.keyCode==39) {
				showNext();
			}
	
		});
		
		
		/* Private functions */
		
	
		function showOverlay(index){
			// If the overlay is already shown, exit

			var back = $('#prevArrow'), next = $('#nextArrow'), counter = items.length-1;

			if(index == 0){
				next.show();
				back.hide();
			} else if(index > 0 && index < counter) {
				next.show();
				back.show();
			} else if(index == counter){
				next.hide();
				back.show();
			}

			$( "#galleryOverlay" ).attr("data-count",index+1 + '/' + items.length );

			if (overlayVisible){
				return false;
			}
			
			// Show the overlay
			overlay.show();
			
			setTimeout(function(){
				// Trigger the opacity CSS transition
				overlay.addClass('visible');
			}, 100);
	
			// Move the slider to the correct image
			offsetSlider(index);
			
			// Raise the visible flag
			overlayVisible = true;
		}
	
		function hideOverlay(){

			// If the overlay is not shown, exit
			if(!overlayVisible){
				return false;
			}
			
			// Hide the overlay
			overlay.hide().removeClass('visible');
			overlayVisible = false;

			//Clear preloaded items
			$('.placeholder').empty();

			//Reset possibly filtered items
			items = allitems;
		}
	
		function offsetSlider(index){

			// This will trigger a smooth css transition
			slider.css('left',(-index*100)+'%');
		}
	
		// Preload an image by its index in the items array
		function preload(index){

			setTimeout(function(){
				showImage(index);
			}, 1000);
		}
		
		// Show image in the slider
		function showImage(index){
	
			// If the index is outside the bonds of the array
			if(index < 0 || index >= items.length){
				return false;
			}
			
			// Call the load function with the href attribute of the item
			loadImage(items.eq(index).attr('data-responsive'), items.eq(index).attr('data-src'), function(){
				placeholders.eq(index).html(this);
			});

			var dataTitle = items.eq(index).attr("data-title"), strLength = 70, windowWidth = $(window).innerWidth();
			dataTitle = dataTitle.length > strLength ? dataTitle.substring(0, strLength - 3) + '...' : dataTitle;

			placeholders.eq(index).attr("data-position",index).attr("data-title",dataTitle);

		}
		
		// Load the image and execute a callback function.
		// Returns a jQuery object

		function loadImage(responsiveSrc, src, callback){

			var allResponsiveSrcArray = responsiveSrc.split(','),
				count = allResponsiveSrcArray.length,
				responsiveSrcArray = [],
				windowWidth,
				screenWidth,
				screenSrc,
				newImgWidth,
				newImgSrc,
				lastArrElementWidth = allResponsiveSrcArray[count - 1].split('|')[1];

			windowWidth = parseInt($(window).width());

			$(window).resize(function() {
				windowWidth = parseInt($(window).width());
			});

			for(i = 0; i< count; i++){

				responsiveSrcArray = allResponsiveSrcArray[i].split('|')
				screenWidth = parseInt(responsiveSrcArray[1])
				screenSrc = responsiveSrcArray[0];

				if (screenWidth <= windowWidth) {
					newImgWidth = screenWidth;
					newImgSrc = responsiveSrcArray[0].replace(/\s/g, '');
				}
			}

			var img = $('<img>').on('load', function(){
				callback.call(img);
			});



			if ( windowWidth > lastArrElementWidth ) {
				img.attr('src',src);
				img.addClass('galleryImage');
			} else {
				img.attr('src',newImgSrc);
				img.addClass('galleryImage');
			}



			$(window).resize(function() {
				var img = $('<img>').on('load', function(){
					callback.call(img);
				});

				if ( windowWidth > lastArrElementWidth ) {
					img.attr('src',src);
					img.addClass('galleryImage');
				} else {
					img.attr('src',newImgSrc);
					img.addClass('galleryImage');
				}
			});


		}
		
		function showNext(){

			// If this is not the last image
			if(index+1 < items.length){
				index++;
				offsetSlider(index);
				preload(index+1);
			}

			else{
				// Trigger the spring animation
				slider.addClass('rightSpring');
				setTimeout(function(){
					slider.removeClass('rightSpring');
				},500);
			}

			var back = $('#prevArrow'), next = $('#nextArrow'), counter = items.length-1;

			if(index == 0){
				next.show();
				back.hide();
			} else if(index > 0 && index < counter) {
				next.show();
				back.show();
			} else if(index == counter){
				next.hide();
				back.show();
			}

			$( "#galleryOverlay" ).attr("data-count",index+1 + '/' + items.length );

		}
		
		function showPrevious(){

			// If this is not the first image
			if(index>0){
				index--;
				offsetSlider(index);
				preload(index-1);
			}

			else{
				// Trigger the spring animation
				slider.addClass('leftSpring');

				setTimeout(function(){
					slider.removeClass('leftSpring');
				},500);
			}

			var back = $('#prevArrow'), next = $('#nextArrow'), counter = items.length-1;

			if(index == 0){
				next.show();
				back.hide();
			} else if(index > 0 && index < counter) {
				next.show();
				back.show();
			} else if(index == counter){
				next.hide();
				back.show();
			}

			$( "#galleryOverlay" ).attr("data-count",index+1 + '/' + items.length );

		}
	};
	
})(jQuery);