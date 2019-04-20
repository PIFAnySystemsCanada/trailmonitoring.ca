/*
 * Serene Full Screen Gallery v2.0.3 (13 Aug 2013)
 *
 * Copyright 2011-2013 ThemeCatcher
 *
 * All rights reserved
 */
(function ($, window) {
    'use strict';
    // Default settings
    var defaults = {
        speed: 2000,                        // Speed of the transition between background images, in milliseconds 1000 = 1 second
        transition: 'fade',                 // The transition animation. 'none', 'fade', 'fadeOutFadeIn', 'slideDown', 'slideRight', 'slideUp', 'slideLeft' 'carouselRight', 'carouselLeft'
        fitLandscape: false,                // If landscape images should be locked to 100% width
        fitPortrait: true,                  // If portrait images should be locked to 100% height
        fitAlways: false,                   // Don't crop images at all
        positionX: 'center',                // Where to position the image on the X axis. 'left', 'center', 'right'
        positionY: 'center',                // Where to position the image on the Y axis. 'top', 'center', 'bottom'
        easing: 'swing',                    // The easing functions to use when transitioning
        slideshow: true,                    // Whether or not to use the slideshow functionality
        slideshowAuto: true,                // Whether or not to start the slideshow automatically
        slideshowSpeed: 5000,               // How long the slideshow stays on one image, in milliseconds
        keyboard: true,                     // Whether or not to use the keyboard controls, left arrow, right arrow and esc key
        captionPosition: 'center bottom',   // The default caption position
        captionSpeed: 600,                  // The speed of the caption fade animation
        bullets: true,                      // Dislay bullet navigation
        lowQuality: false,                  // Turns on lower quality but higher performance transitions
        errorBackground: '',                // Path to the background image shown if there is an error loading an image
        onOpen: false,                      // Callback when the gallery opens
        onLoad: false,                      // Callback when the current image starts loading
        onComplete: false,                  // Callback when the current image has completely loaded
        onCleanup: false,                   // Callback when cleaning up, just before closing
        onClose: false,                     // Callback when the gallery closes,
        captionEnhancement: function () {}  // Caption enhancement function e.g. replace Cufon
    },

    // Wrappers & overlay
    $outer,
    $overlay,
    $stage,
    $captionOuter,
    $caption,

    // Next & current slides
    $currentSlide,
    $nextSlide,

    // Controls
    $controlsWrap,
    $controls,
    $prev,
    $play,
    $next,
    $loadingWrap,
    $loading,
    $closeWrap,
    $close,
    $bullets,

    // Window & body
    $window,
    $body,

    // Events
    eventOpen = 'sereneOpen',
    eventLoad = 'sereneLoad',
    eventComplete = 'sereneComplete',
    eventCleanup = 'sereneCleanup',
    eventClose = 'sereneClose',

    // Misc
    $images,
    imageCache = [],
    bodyOverflow,
    currentIndex = 0,
    total,
    animating = false,
    open = false,
    settings,
    serene,
    captionXPositions = ['left', 'center', 'right'],
    captionYPositions = ['top', 'center', 'bottom'],
    slideshowTimeout,
    slideshowStarted = false;

    /**
     * Load the image with the given index
     *
     * @param int index The index of the image to load.
     * @param function callback Callback function to call when loading is finished.
     */
    function load(index, callback) {
        var $trigger = $images.eq(index);
        if ($trigger.length && imageCache[index] === undefined) {
            imageCache[index] = true;

            var $image = $('<img/>'),
            errorLoading = false;

            $image.load(function () {
                $image.unbind('load');

                setTimeout(function () {
                    setImageData($image);
                    resizeImages();

                    if (typeof callback === 'function') {
                        callback();
                    }
                }, 1); // Chrome will sometimes report a 0 by 0 size if there isn't pause in execution
            })
            .bind('error', function () {
                if (!errorLoading && settings.errorBackground) {
                    $image.attr('src', settings.errorBackground);
                }
                errorLoading = true;
            });

            setTimeout(function () {
                $image.attr('src', $trigger.attr('href'));
                $('div', $stage).eq(index).append($image);
            }, 1); // Opera 10.6+ will sometimes load the src before the onload function is set, so wait 1ms
        }
    }

    /**
     * Get the index of the next image
     *
     * @return int
     */
    function getNextIndex() {
        return (currentIndex === (total - 1)) ? 0 : currentIndex + 1;
    }

    /**
     * Get the index of the prev image
     *
     * @return int
     */
    function getPrevIndex() {
        return (currentIndex === 0) ? total - 1 : currentIndex - 1;
    }

    /**
     * Return a random value from the given array
     *
     * @param array array
     * @return array
     */
    function random(array)
    {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Trigger the given event and call callback
     *
     * @param string event
     * @param function callback
     */
    function trigger(event, callback) {
        if (typeof callback === 'function') {
            callback();
        }

        $outer.trigger(event);
    }

    /**
     * Intialisation
     *
     * Sets up the HTML elements and JavaScript bindings.
     */
    function init() {
        // Cache some common vars
        $window = $(window);
        $body = $('body');

        // Create the div structure
        $outer = $('<div class="serene-outer"></div>').append(
            $overlay = $('<div class="serene-overlay"></div>'),
            $stage = $('<div class="serene-stage"></div>'),
            $captionOuter = $('<div class="serene-caption-outer"></div>').append(
                $('<div class="serene-caption-helper"></div>').append(
                    $caption = $('<div class="serene-caption"></div>')
                )
            ),
            $controlsWrap = $('<div class="serene-controls-outer"></div>').append(
                $controls = $('<div class="serene-controls"></div>').append(
                    $prev = $('<div class="serene-prev"></div>'),
                    $play = $('<div class="serene-play"></div>'),
                    $next = $('<div class="serene-next"></div>')
                ),
                $loadingWrap = $('<div class="serene-loading-wrap"></div>').append(
                    $loading = $('<div class="serene-loading"></div>')
                ),
                $closeWrap = $('<div class="serene-close-wrap"></div>').append(
                    $close = $('<div class="serene-close"></div>')
                )
            )
        );

        // Put the controls on the page
        $body.append($outer);

        // Bind the next button to load the next image
        $next.click(function () {
            serene.next();
            return false;
        });

        // Bind the prev button to load the previous image
        $prev.click(function () {
            serene.prev();
            return false;
        });

        // Bind the close button to close it
        $closeWrap.click(serene.close);

        // Save the current body overflow value
        bodyOverflow = $body.css('overflow');

        $body.delegate('.serene-element', 'click', function (e) {
            e.preventDefault();
            trigger(eventOpen, settings.onOpen);
            $overlay.css('opacity', settings.opacity).add($stage).show();
            $body.css('overflow', 'hidden');
            open = true;
            prepare($(this));
        });
    }

    // Prepare the first image to be shown
    function prepare($element) {
        $images = $element;
        var rel = $element.attr('rel');

        if (rel) {
            $images = $('.serene-element').filter(function () {
                return (this.rel === rel);
            });
            currentIndex = $images.index($element);
        }

        total = $images.length;

        for (var i = 0; i < total; i++) {
            $stage.append('<div class="serene-slide"/>');
        }

        if (total > 1) {
            $controls.show();
            $stage.click(function () {
                $next.click();
            }).css('cursor', 'pointer');

            if (settings.keyboard) {
                // Key bindings right arrow, left arrow and esc key
                $(document).bind('keydown.serene', function (e) {
                    if (open && e.keyCode === 27) {
                        e.preventDefault();
                        serene.close();
                    }
                    if (open && total > 1) {
                        if (e.keyCode === 37) {
                            e.preventDefault();
                            $prev.click();
                        } else if (e.keyCode === 39) {
                            e.preventDefault();
                            $next.click();
                        }
                    }
                });
            }

            // Slideshow functionality
            if (settings.slideshow) {
                if (settings.slideshowAuto) {
                    serene.start();
                } else {
                    serene.stop();
                }

                $play.show();
                $controlsWrap.addClass('serene-slideshow');
            }

            // Bullets functionality
            if (settings.bullets) {
                $bullets = $('<div class="serene-bullets"/>');

                for (var j = 0; j < total; j++) {
                    var title = $images.eq(j).data('title') || '';
                    $('<div class="serene-bullet">' + j + '</div>').data('index', j).attr('title', title).appendTo($bullets);
                }

                $('.serene-bullet', $bullets).click(function () {
                    serene.go($(this).data('index'));
                    return false;
                });

                $controls.append($bullets);
            }
        } else {
            $controlsWrap.addClass('serene-single');
        }

        // Fade in the controls
        $controlsWrap.fadeIn(settings.controlSpeed);

        // Preload the previous image
        if (total > 2) {
            load(getPrevIndex());
        }

        // Load the current image then do the first transition
        var loadingTimeout = setTimeout(function () { $controlsWrap.addClass('serene-load'); }, 200);
        load(currentIndex, function () {
            clearTimeout(loadingTimeout);
            $controlsWrap.removeClass('serene-load');

            // Bind the resize funtion when the window is resized
            $window.resize($.isFunction($.throttle) ? $.throttle(100, resizeImages) : resizeImages);

            // Do the first transition
            doTransition();
        });

        // Preload the next image
        load(getNextIndex());
    }

    /**
     * Resize the images
     *
     * @param function callback Called after the resize is complete
     */
    function resizeImages() {
        var windowWidth = $stage.width(),
        windowHeight = $stage.height(),
        windowRatio = windowHeight / windowWidth;

        $('img', $stage).each(function () {
            var $image = $(this),
            imageRatio = $image.data('imageRatio'),
            css = {};

            if (windowRatio > imageRatio) {
                // Window is more "portrait" than the image
                if (settings.fitAlways) {
                    $image.width(windowWidth).height(windowWidth * imageRatio);
                } else {
                    if (imageRatio <= 1 && settings.fitLandscape) {
                        $image.width(windowWidth).height(windowWidth * imageRatio);
                    } else {
                        $image.height(windowHeight).width(windowHeight / imageRatio);
                    }
                }
            } else {
                // Window is more "landscape" than the image
                if (settings.fitAlways) {
                    $image.height(windowHeight).width(windowHeight / imageRatio);
                } else {
                    if (imageRatio > 1 && settings.fitPortrait) {
                        $image.height(windowHeight).width(windowHeight / imageRatio);
                    } else {
                        $image.width(windowWidth).height(windowWidth * imageRatio);
                    }
                }
            }

            switch (settings.positionX) {
                case 'left':
                    css.left = 0;
                    css.right = 'auto';
                    break;
                case 'right':
                    css.left = 'auto';
                    css.right = 0;
                    break;
                default:
                case 'center':
                    css.left = ((windowWidth - $image.width()) / 2) + 'px';
                    css.right = 'auto';
                    break;
            }

            switch (settings.positionY) {
                case 'top':
                    css.top = 0;
                    css.bottom = 'auto';
                    break;
                case 'bottom':
                    css.top = 'auto';
                    css.bottom = 0;
                    break;
                default:
                case 'center':
                    css.top = ((windowHeight - $image.height()) / 2) + 'px';
                    css.bottom = 'auto';
                    break;
            }

            $image.css(css);
        });
    }

    /**
     * Save the image data to use later
     *
     * @param object $image The jQuery object of the image.
     */
    function setImageData($image) {
        var imageWidth = $image.width(),
        imageHeight = $image.height();

        $image.data({
            imageWidth: imageWidth,
            imageHeight: imageHeight,
            imageRatio: imageHeight / imageWidth
        });
    }

    /**
     * Do the transtion animation
     *
     * @param boolean reverse Reverse the transition animation.
     */
    function doTransition (reverse) {
        trigger(eventLoad, settings.onLoad);
        animating = true;

        $controlsWrap.addClass('serene-animating');
        $('.serene-prev-slide', $stage).removeClass('serene-prev-slide');

        $currentSlide = $('.serene-current-slide', $stage).removeClass('serene-current-slide').addClass('serene-prev-slide');
        $nextSlide = $('div:eq(' + currentIndex + ')', $stage);

        // Preload the next image in the direction we are going
        if (!reverse) {
            load(getNextIndex());
        } else {
            load(getPrevIndex());
        }

        setActiveBullet();

        // Hide captions before transitioning
        if (settings.transition === 'none') {
            $captionOuter.hide();
        } else {
            $captionOuter.stop().animate({opacity: 0}, settings.captionSpeed, function () {
                $captionOuter.hide();
            });
        }

        $nextSlide.css('visibility', 'hidden').addClass('serene-current-slide');

        if (settings.lowQuality) {
            $stage.addClass('serene-low');
        }

        switch (settings.transition) {
            case 'none':
                $nextSlide.css('visibility', 'visible'); doneTransition();
                break;
            default:
            case 'fade':
                $nextSlide.animate({ opacity: 0 }, 0).css('visibility', 'visible').animate({ opacity: 1 }, settings.speed, settings.easing, doneTransition);
                break;
            case 'fadeOutFadeIn':
                var fadeIn = function () {
                    $nextSlide.animate({ opacity: 0 }, 0).css('visibility', 'visible').animate({ opacity: 1 }, settings.speed, settings.easing, doneTransition);
                };

                if ($currentSlide.length) {
                    $currentSlide.animate({opacity: 0}, settings.speed, settings.easing, fadeIn);
                } else {
                    fadeIn();
                }
                break;
            case 'slideDown':
                if (!reverse) {
                    $nextSlide.animate({ top: -$stage.height() }, 0).css('visibility', 'visible').animate({ top: 0 }, settings.speed, settings.easing, doneTransition);
                } else {
                    $nextSlide.animate({ top: $stage.height() }, 0).css('visibility', 'visible').animate({ top: 0 }, settings.speed, settings.easing, doneTransition);
                }
                break;
            case 'slideRight':
                if (!reverse) {
                    $nextSlide.animate({ left: $stage.width() }, 0).css('visibility', 'visible').animate({ left: 0 }, settings.speed, settings.easing, doneTransition);
                } else {
                    $nextSlide.animate({ left: -$stage.width() }, 0).css('visibility', 'visible').animate({ left: 0 }, settings.speed, settings.easing, doneTransition);
                }
                break;
            case 'slideUp':
                if (!reverse) {
                    $nextSlide.animate({ top: $stage.height() }, 0).css('visibility', 'visible').animate({ top: 0 }, settings.speed, settings.easing, doneTransition);
                } else {
                    $nextSlide.animate({ top: -$stage.height() }, 0).css('visibility', 'visible').animate({ top: 0 }, settings.speed, settings.easing, doneTransition);
                }
                break;
            case 'slideLeft':
                if (!reverse) {
                    $nextSlide.animate({ left: -$stage.width() }, 0).css('visibility', 'visible').animate({ left: 0 }, settings.speed, settings.easing, doneTransition);
                } else {
                    $nextSlide.animate({ left: $stage.width() }, 0).css('visibility', 'visible').animate({ left: 0 }, settings.speed, settings.easing, doneTransition);
                }
                break;
            case 'carouselRight':
                if (!reverse) {
                    $nextSlide.animate({ left: $stage.width() }, 0).css('visibility', 'visible').animate({ left: 0 }, settings.speed, settings.easing, doneTransition);
                    $currentSlide.animate({ left: -$stage.width() }, settings.speed, settings.easing);
                } else {
                    $nextSlide.animate({ left: -$stage.width() }, 0).css('visibility', 'visible').animate({ left: 0 }, settings.speed, settings.easing, doneTransition);
                    $currentSlide.animate({ left: 0 }, 0).animate({left: $stage.width()}, settings.speed, settings.easing);
                }
                break;
            case 'carouselLeft':
                if (!reverse) {
                    $nextSlide.animate({ left: -$stage.width() }, 0).css('visibility', 'visible').animate({ left: 0 }, settings.speed, settings.easing, doneTransition);
                    $currentSlide.animate({left: $stage.width()}, settings.speed, settings.easing);
                } else {
                    $nextSlide.animate({ left: $stage.width() }, 0).css('visibility', 'visible').animate({ left: 0 }, settings.speed, settings.easing, doneTransition);
                    $currentSlide.animate({ left: 0 }, 0).animate({left: -$stage.width()}, settings.speed, settings.easing);
                }
                break;
        }
    }

    /**
     * Actions to run when the transition animation is complete
     */
    function doneTransition() {
        animating = false;

        if (settings.lowQuality) {
            $stage.removeClass('serene-low');
        }

        var $image = $images.eq(currentIndex),
            captionElementId = $image.data('caption'),
            caption = captionElementId ? $(captionElementId).html() : '',
            captionPosition = $image.data('caption-position') || settings.captionPosition;

        if (captionPosition === 'random') {
            captionPosition = random(captionXPositions) + ' ' + random(captionYPositions);
        }

        if (caption && open) {
            $caption.html(caption);
            settings.captionEnhancement.call($captionOuter);
            $captionOuter.attr('class', 'serene-caption-outer')
                         .addClass('serene-position-' + captionPosition.split(' ').join('-'))
                         .stop().show().animate({opacity: 1}, settings.captionSpeed);
        }

        $controlsWrap.removeClass('serene-animating');

        trigger(eventComplete, settings.onComplete);
    }

    // Set the active bullet
    function setActiveBullet()
    {
        if (settings.bullets && total > 1) {
            $bullets.children().removeClass('active-bullet').eq(currentIndex).addClass('active-bullet');
        }
    }

    serene = $.fn.serene = function (options) {
        var $this = this;

        if (!$this[0] && $this.selector) {
            return $this;
        }

        settings = $.extend({}, defaults, options || {});

        return $this.each(function () {
            $(this).addClass('serene-element');
        });
    };

    serene.close = function () {
        trigger(eventCleanup, settings.onCleanup);

        // Reset animations
        animating = false;

        if (settings.lowQuality) {
            $stage.removeClass('serene-low');
        }

        if ($currentSlide && $currentSlide.length) {
            $currentSlide.stop();
        }

        if ($nextSlide && $nextSlide.length) {
            $nextSlide.stop();
        }

        // Controls
        $controlsWrap.removeClass('serene-animating').stop(true, true).hide();

        // Stop slideshow
        if (settings.slideshow) {
            clearTimeout(slideshowTimeout);
        }

        // Remove any slides from the stage and clear the cache
        $('.serene-slide', $stage).remove();
        imageCache = [];

        // Reset the caption position class and HTML
        $captionOuter.stop(true, true).hide().attr('class', 'serene-caption-outer');
        $caption.html('');

        // Remove any bullets
        if (settings.bullets) {
            $('.serene-bullets', $controls).remove();
        }

        $body.css('overflow', bodyOverflow);
        $overlay.add($stage).hide();

        open = false;

        if (settings.keyboard) {
            $(document).unbind('keydown.serene');
        }

        trigger(eventClose, settings.onClose);
    };

    serene.next = function () {
        if (animating) {
            return false;
        }

        currentIndex = getNextIndex();
        doTransition();
    };

    serene.prev = function () {
        if (animating) {
            return false;
        }

        currentIndex = getPrevIndex();
        doTransition(true);
    };

    /**
     * Load the image at the given index
     */
    serene.go = function (index) {
        if (animating || currentIndex === index) {
            return false;
        }

        if (index > currentIndex) {
            currentIndex = index;

            // Make sure this image is loaded
            if (imageCache[currentIndex] === undefined) {
                load(currentIndex, doTransition);
            } else {
                doTransition();
            }
        } else {
            currentIndex = index;

            // Make sure this image is loaded
            if (imageCache[currentIndex] === undefined) {
                load(currentIndex, function () {
                    doTransition(true);
                });
            } else {
                doTransition();
            }
        }
    };

    serene.start = function () {
        if (settings.slideshow && !slideshowStarted) {
            slideshowStarted = true;

            $outer.bind(eventComplete, function () {
                slideshowTimeout = setTimeout(serene.next, settings.slideshowSpeed);
            })
            .bind(eventLoad, function () {
                clearTimeout(slideshowTimeout);
            }).bind(eventCleanup, serene.stop);

            $play
                .removeClass('serene-play')
                .addClass('serene-pause')
                .unbind('click')
                .one('click', serene.stop);

            slideshowTimeout = setTimeout(serene.next, settings.slideshowSpeed);
        }
    };

    serene.stop = function () {
        if (settings.slideshow) {
            clearTimeout(slideshowTimeout);

            $outer.unbind([eventComplete, eventLoad, eventCleanup].join(' '));

            $play
                .unbind('click')
                .removeClass('serene-pause')
                .addClass('serene-play')
                .one('click', serene.start);

            slideshowStarted = false;
        }
    };

    $(document).ready(function () {
        init();
    });
})(jQuery, window);
