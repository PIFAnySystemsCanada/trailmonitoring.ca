;(function($, window) {
	/** Settings **/

	// List of background images to use, the default image will be the first one in the list
	var backgrounds = [
		'images/backgrounds/placeholder.jpg'
	],

	// Background options - see documentation
	backgroundOptions = {

	},

	// Twitter username
	twitterUsername = 'ThemeCatcher',

	// Number tweets to show, set to 0 to disable
	tweetCount = 2,

	// The text inside the search field
	searchBoxText = 'Search',

	// The text inside the view map button when map is visible
	hideMapButtonText = 'Hide map';

	/** End settings **/

	Cufon.replace('h1, h2, h3, h4, h5');

	$('html').addClass('js-enabled');

	$(document).ready(function() {
		// Put the full screen mini controls container on the page
		$('.foot-right-col').after($('<div id="fs-controls">'));

		$.fullscreen(
			$.extend(backgroundOptions, {
				backgrounds: window.backgrounds || backgrounds,
				backgroundIndex: window.backgroundIndex,
				contentSelector: '.outside',
				captionEnhancement: function ($caption) {
					if (!!window.Cufon) {
						Cufon.replace($('h1', $caption));
					}
				}
			})
		);

		$('#minimise-button').click(function () {
			$.fullscreen.max();
			return false;
		});

		// Initialise the menu
		$('ul.sf-menu').superfish({ speed: 0 });

		// Bind the search button to show/hide the search field
		$('#search-button').click(function() {
			$('.search-container').fadeToggle();
			return false;
		});

		// Bind the social button to show/hide the social icons box
		$('#social-pop-out-trigger').click(function() {
			var $allBoxes = $('.footer-pop-out-box');
			if ($allBoxes.is(':animated')) {
				return false;
			}

			var $thisBox = $('.social-pop-out-box');
			if ($thisBox.is(':visible')) {
				$thisBox.slideUp();
			} else {
				if ($allBoxes.is(':visible')) {
					$allBoxes.filter(':visible').slideUp(function() {
						$thisBox.slideDown();
					});
				} else {
					$thisBox.slideDown();
				}
			}

			return false;
		});

		// Bind the Twitter button to show/hide the Twitter feed box
		$('#twitter-pop-out-trigger').click(function() {
			var $allBoxes = $('.footer-pop-out-box');
			if ($allBoxes.is(':animated')) {
				return false;
			}

			var $thisBox = $('.twitter-pop-out-box');
			if ($thisBox.is(':visible')) {
				$thisBox.slideUp();
			} else {
				if ($allBoxes.is(':visible')) {
					$allBoxes.filter(':visible').slideUp(function() {
						$thisBox.slideDown();
					});
				} else {
					$thisBox.slideDown();
				}
			}

			return false;
		});

		// Bind any links with the class 'scroll-top' to animate the scroll to the top
		$('a.scroll-top').click(function () {
			if ($.isFunction($.fn.smoothScroll)) {
				$.smoothScroll();
			}
			return false;
		});

		var $heightSaver = $('<div id="height-saver"></div>');

		// Bind the navigation to change the page hash
		$('#horz-nav-ul a, .ajax-link').live('click', function() {
			if (!$(this).hasClass('non-link') && !$(this).hasClass('non-ajax')) {
				window.location.hash = $(this).attr('href');
			}
			if (!$(this).hasClass('non-ajax')) {
				return false;
			}
		});

		// Callback for the .load() function, this will be loaded when the new page content has been loaded
		var ajaxCallback = function() {
			// Refresh the cufons
			Cufon.refresh();

			// Bind the view map button to slide down / up the map
			var $viewMapButton = $('.view-map'),
			$mapImg = $('.hidden-map'),
			$contactInfoWrap = $('.contact-info-wrap'),
			viewMapButtonText = $('.view-map').text();

			$viewMapButton.click(function() {
				if (!$mapImg.add($contactInfoWrap).is(':animated')) {
					if (!$mapImg.hasClass('map-visible')) {
						$contactInfoWrap.slideUp(600, function() {
							$mapImg.slideDown(600, function() {
								$mapImg.addClass('map-visible');
								$viewMapButton.text(hideMapButtonText);
							});
						});
					} else {
						$mapImg.removeClass('map-visible').slideUp(600, function() {
							$contactInfoWrap.slideDown(600, function() {
								$viewMapButton.text(viewMapButtonText);
							});
						});
					}
				}
				return false;
			});

			// Make the form inputs and search fields clear value when focused
			$('#search-input').toggleVal({ populateFrom: 'custom', text: searchBoxText });
			//$('.toggle-val').toggleVal({ populateFrom: 'label', removeLabels: true });

			// Create the gallery rollover effect
			$('li.one-portfolio-item a').append(
				$('<div class="portfolio-hover"></div>').css({ opacity: 0, display: 'block' })
			).hover(function() {
				$(this).find('.portfolio-hover').stop().fadeTo(400, 0.6);
			}, function() {
				$(this).find('.portfolio-hover').stop().fadeTo(400, 0.0);
			});

			// Gallery
			$('.serene-portfolio a.portfolio-thumb-link').serene({
				onOpen: $.fullscreen.unbindKeyboard,
				onClose: $.fullscreen.bindKeyboard,
				captionEnhancement: function ($caption) {
					if (!!window.Cufon) {
						Cufon.replace($('h1', $caption));
					}
				}
			});

			$('form.quform').Quform();

			// Tooltip settings
			if ($.isFunction($.fn.qtip)) {
				$('.quform-tooltip').qtip({
					content: {
						text: false
					},
					style: {
						classes: 'qtip-dark quform-tt',
						width: '220px'
					},
					position: {
						my: 'left center',
						at: 'right center'
					}
				});
			}

			// Changes subject to a text field when 'Other' is chosen
			$('#subject').replaceSelectWithTextInput({onValue: 'Other'});

			// Fade in the content
			$('.content-inner').fadeIn(800);

			// Remove the temporary height div
			$heightSaver.css('height', 0).remove();
		};

		// Bind the function to be run when the hash changes
		$(window).bind('hashchange', function() {
			var hash = window.location.hash.substr(1);

			if (hash) {
				// Add a div of the same height to prevent scrollbar flicker
				$('.content-inner').fadeOut().hide(0, function() {
					$heightSaver.remove().css('height', $('.content-inner').height()).appendTo($('.content-outer'));
					$('.content-outer').load(hash + ' .content-inner', ajaxCallback);
				});
			} else {
				$('.content-inner').fadeIn(800);
			}
		});

		// Fire the hashchange event manually
		$(window).hashchange();
	}); // End (document).ready

	$(window).load(function() {
		// Load the Twitter feed
		if (twitterUsername && tweetCount > 0) {
			$("#twitter_div").tweet({
				username: twitterUsername,
				count: tweetCount,
	            twitter_api_proxy_url: "js/twitter/index.php",
	            template: '{text} {time}'
	        });
		}

		// Preload images
		window.preload([
	        'images/nav-a-bg1.png',
			'images/search1.png',
			'images/minimise1.png',
			'images/2-col-hover.png',
			'images/3-col-hover.png',
			'images/4-col-hover.png',
			'images/5-col-hover.png',
			'images/6-col-hover.png',
			'images/grid-hover.png',
			'images/opacity-80-rep.png',
			'images/loading.gif',
		    'images/backward1.png',
		    'images/play.png',
		    'images/play1.png',
		    'images/pause.png',
		    'images/pause1.png',
		    'images/forward1.png',
		    'images/close-icon.png',
		    'images/close-icon-hover.png',
		    'images/fs-max1.png'
		]);
	}); // End (window).load
})(jQuery, window);